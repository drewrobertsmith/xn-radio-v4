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
  // useQueuePersistence();

  //--- Player Controls ---//

  const play = useCallback(
    async (item: Track) => {
      if (currentTrack?.id !== item.id) {
        await TrackPlayer.setQueue([item]);
        audio$.queue.tracks.set([item]);
      }
      await TrackPlayer.play();
    },
    [currentTrack],
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

  //--- QUEUE CONTROL ---//

  // const addToBackOfQueue = useCallback(
  //   async (item: Track) => {
  //     if (!audio$.queue.tracks.some((track) => track.id.get() === item.id)) {
  //       const wasQueueEmpty = audio$.queue.tracks.get().length === 0;
  //       audio$.queue.tracks.push(item);
  //
  //       // If the queue was empty, this new track is now the first one.
  //       // Load it into the player so it's ready.
  //       if (wasQueueEmpty) {
  //         loadTrack(item);
  //         audio$.playbackState.set("paused");
  //       }
  //     } else {
  //       Alert.alert("Episode already in queue");
  //     }
  //   },
  //   [loadTrack],
  // );
  const addToBackOfQueue = () => { };

  // const addToTopOfQueue = useCallback(
  //   (item: Track) => {
  //     // Get the current queue and filter out the item if it already exists.
  //     const currentQueue = audio$.queue.tracks.get();
  //     const newQueue = currentQueue.filter(
  //       (track: Track) => track.id !== item.id,
  //     );
  //
  //     // Add the item to the very beginning of the new queue.
  //     newQueue.unshift(item);
  //
  //     // Set the new queue state.
  //     audio$.queue.tracks.set(newQueue);
  //
  //     // Since this is now the first item, load it into the player.
  //     loadTrack(item);
  //     // Set state to paused, making it "ready to play".
  //     audio$.playbackState.set("paused");
  //   },
  //   [loadTrack],
  // );
  const addToTopOfQueue = () => { };

  // const removeFromQueue = useCallback(
  //   (trackId: string) => {
  //     if (!player) return;
  //
  //     // Get the current track *before* modifying the queue.
  //     const currentTrackBeforeRemoval = audio$.currentTrack.get();
  //
  //     // Create the new queue by filtering out the track to be removed.
  //     const newQueue = audio$.queue.tracks
  //       .get()
  //       .filter((track) => track.id !== trackId);
  //
  //     // Set the new state. This will trigger persistence hook automatically.
  //     audio$.queue.tracks.set(newQueue);
  //
  //     // If the track just removed was the currently active one...
  //     if (currentTrackBeforeRemoval?.id === trackId) {
  //       player.pause();
  //       // player.replace(null); // Stop and unload the old audio.
  //       // Get the new track at the top of the queue (if it exists).
  //       const nextTrack = audio$.queue.tracks.get()[0];
  //       if (nextTrack) {
  //         // If there's a new track, load it and set the state to paused.
  //         loadTrack(nextTrack);
  //         audio$.playbackState.set("paused");
  //       } else {
  //         // If the queue is now empty, set the state to idle.
  //         audio$.playbackState.set("idle");
  //       }
  //     }
  //   },
  //   [player, loadTrack],
  // );
  const removeFromQueue = () => { };

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
