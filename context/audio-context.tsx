import React, { createContext, useCallback, useContext } from "react";
import { audio$ } from "../state/audio";
import { usePlaybackPersistence } from "@/hooks/usePlaybackPersistence";
import { useQueuePersistence } from "@/hooks/useQueuePersistence";
import TrackPlayer, { Track } from "react-native-track-player";

// The context now just provides the player instance and actions
interface AudioContextType {
  play: (item: Track) => void;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
  playNextInQueue: (item: Track) => void;
  addToBackOfQueue: (item: Track) => void;
  removeFromQueue: (trackId: string) => void;
  saveCurrentTrackProgress: () => void;
  clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const { saveCurrentTrackProgress } = usePlaybackPersistence();
  useQueuePersistence();

  //--- Player Controls ---//

  const play = useCallback(async (item: Track) => {
    const playerQueue = await TrackPlayer.getQueue();
    const currentTrack = await TrackPlayer.getActiveTrack();

    // Check for a saved position BEFORE we do anything else.
    const savedPosition = audio$.savedProgress[item.id].get();

    // Scenario 1: The track is in the queue, but not active.
    const indexInQueue = playerQueue.findIndex((track) => track.id === item.id);
    if (indexInQueue > -1) {
      await TrackPlayer.skip(indexInQueue);
      // If we have a saved position, seek to it now.
      if (savedPosition && savedPosition > 0) {
        await TrackPlayer.seekTo(savedPosition);
      }

      await TrackPlayer.play();
      return;
    }

    // Scenario 2: The track is not in the queue at all.
    console.log("TRACK IS NOT IN QUEUE");
    await TrackPlayer.add(item, 0);

    const newLocalQueue = [item, ...audio$.queue.tracks.get()];
    audio$.queue.tracks.set(newLocalQueue);

    await TrackPlayer.skip(0, savedPosition);
    console.log("Playing: ", currentTrack);
    // audio$.currentTrack.set(item);
    await TrackPlayer.play();
  }, []);

  const pause = useCallback(async () => {
    saveCurrentTrackProgress();
    await TrackPlayer.pause();
  }, [saveCurrentTrackProgress]);

  const stop = useCallback(async () => {
    await TrackPlayer.stop();
  }, []);

  const seekTo = useCallback(
    async (seconds: number) => {
      await TrackPlayer.seekTo(seconds);
      saveCurrentTrackProgress();
    },
    [saveCurrentTrackProgress],
  );

  //--- QUEUE CONTROL ---//

  // This function adds a track to the very end of the queue.
  const addToBackOfQueue = useCallback(async (item: Track) => {
    // 1. Check against our Legend State mirror to prevent duplicates
    const currentQueue = audio$.queue.tracks.get();
    if (currentQueue.some((track) => track.id === item.id)) return;
    // 2. Command the player to add the track
    await TrackPlayer.add(item);
    audio$.queue.tracks.push(item);
  }, []);

  // This function is for "Play Next". It adds a track right after the current one.
  const playNextInQueue = useCallback(async (item: Track) => {
    // Get the current queue and filter out the item if it already exists.
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
    const insertAtIndex =
      currentTrackIndex !== undefined ? currentTrackIndex + 1 : 0;
    await TrackPlayer.add(item, insertAtIndex);
  }, []);

  const removeFromQueue = useCallback(async (trackId: string) => {
    // 1. Find the index of the track to remove from the REAL player queue
    const playerQueue = await TrackPlayer.getQueue();
    const indexToRemove = playerQueue.findIndex(
      (track) => track.id === trackId,
    );

    //if track id found in trackplayer queue
    if (indexToRemove !== -1) {
      //remove from trackplayer
      await TrackPlayer.remove(indexToRemove);

      //update audio$ queue

      const newLocalQueue = audio$.queue.tracks
        .get()
        .filter((track) => track.id !== trackId);
      audio$.queue.tracks.set(newLocalQueue);
    }
  }, []);

  const clearQueue = useCallback(async () => {
    await TrackPlayer.removeUpcomingTracks();
    const activeTrack = audio$.currentTrack.get();
    const newLocalQueue = audio$.queue.tracks
      .get()
      .filter((track) => track.id === activeTrack?.id);
    audio$.queue.tracks.set(newLocalQueue);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        play,
        pause,
        stop,
        seekTo,
        playNextInQueue,
        addToBackOfQueue,
        removeFromQueue,
        saveCurrentTrackProgress,
        clearQueue,
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
