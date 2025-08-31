import React, { createContext, useCallback, useContext } from "react";
import { audio$ } from "../state/audio";
import { usePlaybackPersistence } from "@/hooks/usePlaybackPersistence";
import { useQueuePersistence } from "@/hooks/useQueuePersistence";
import TrackPlayer, { Track } from "react-native-track-player";
import { use$ } from "@legendapp/state/react";

// The context now just provides the player instance and actions
interface AudioContextType {
  play: (item: Track) => void;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
  addToTopOfQueue: (item: Track) => void;
  addToBackOfQueue: (item: Track) => void;
  removeFromQueue: (trackId: string) => void;
  saveCurrentTrackProgress: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const currentTrack = use$(audio$.currentTrack);

  const { saveCurrentTrackProgress } = usePlaybackPersistence();
  useQueuePersistence();

  //--- QUEUE CONTROL ---//

  const addToBackOfQueue = useCallback(async (item: Track) => {
    // 1. Check against our Legend State mirror to prevent duplicates
    const currentQueue = audio$.queue.tracks.get();
    if (currentQueue.some((track) => track.id === item.id)) {
      // Alert.alert("Episode already in queue");
      return;
    }
    // 2. Command the player to add the track
    await TrackPlayer.add(item);
    // 3. Synchronize our Legend State mirror
    audio$.queue.tracks.push(item);
  }, []);

  const addToTopOfQueue = useCallback(async (item: Track) => {
    // Get the current queue and filter out the item if it already exists.
    const currentQueue = audio$.queue.tracks.get();
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
    const insertAtIndex =
      currentTrackIndex !== undefined ? currentTrackIndex + 1 : 0;
    await TrackPlayer.add(item, insertAtIndex);

    // 2. Synchronize our Legend State mirror
    const newQueue = [...currentQueue];
    newQueue.splice(insertAtIndex, 0, item);
    audio$.queue.tracks.set(newQueue);
  }, []);

  const removeFromQueue = useCallback(async (trackId: string) => {
    // 1. Find the index of the track to remove from the REAL player queue
    const playerQueue = await TrackPlayer.getQueue();
    const indexToRemove = playerQueue.findIndex(
      (track) => track.id === trackId,
    );

    if (indexToRemove !== -1) {
      await TrackPlayer.remove(indexToRemove);

      // 3. Synchronize our Legend State mirror
      const newLocalQueue = audio$.queue.tracks
        .get()
        .filter((track) => track.id !== trackId);
      audio$.queue.tracks.set(newLocalQueue);
    }
  }, []);

  //--- Player Controls ---//

  const play = useCallback(
    async (item: Track) => {
      const isNewTrack = currentTrack?.id !== item.id;

      if (isNewTrack) {
        addToTopOfQueue(item);
      }

      // Before playing, get the saved position from our GLOBAL STATE, not storage.
      // .get() will return undefined if no progress is saved for this track.
      const savedPosition = audio$.savedProgress[item.id].get();

      // If we are playing a new track and found a saved position, seek to it.
      if (isNewTrack && savedPosition && savedPosition > 0) {
        console.log(
          `Found saved progress for ${item.id} in state, seeking to ${savedPosition}s`,
        );
        await TrackPlayer.seekTo(savedPosition);
      }
      await TrackPlayer.play();
    },
    [currentTrack, addToTopOfQueue],
  );

  const pause = useCallback(async () => {
    saveCurrentTrackProgress();
    await TrackPlayer.pause();
  }, [saveCurrentTrackProgress]);

  const stop = useCallback(async () => {
    await TrackPlayer.stop();
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    await TrackPlayer.seekTo(seconds);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        play,
        pause,
        stop,
        seekTo,
        addToTopOfQueue,
        addToBackOfQueue,
        removeFromQueue,
        saveCurrentTrackProgress,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used wiht an AudioProvider");
  }
  return context;
};
