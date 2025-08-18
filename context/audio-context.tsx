import {
  AudioPlayer,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { Alert } from "react-native";
import { audio$, Track } from "../state/audio";
import { useObserve } from "@legendapp/state/react";
import { usePlaybackPersistence } from "@/hooks/usePlaybackPersistence";
import { useQueuePersistence } from "@/hooks/useQueuePersistence";

// The context now just provides the player instance and actions
interface AudioContextType {
  player: AudioPlayer;
  play: (item: Track) => void;
  pause: () => void;
  resume: () => void;
  seekTo: (seconds: number) => void;
  addToTopOfQueue: (item: Track) => void;
  addToBackOfQueue: (item: Track) => void;
  removeFromQueue: (trackId: string) => void;
  saveCurrentTrackProgress: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const { saveCurrentTrackProgress } = usePlaybackPersistence();
  useQueuePersistence();

  // configure the audio session on mount
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        await setAudioModeAsync({
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          interruptionModeAndroid: "doNotMix",
          interruptionMode: "doNotMix",
        });
        console.log("Audio session configured for background playback.");
      } catch (e) {
        const errorMessage =
          e instanceof Error
            ? e.message
            : "An  unknown error occired while setting audio mode";
        Alert.alert("Audio Error", errorMessage);
      }
    };

    configureAudioSession();

    //unload the player when the provider is unmounted
    return () => {
      player.release();
    };
  }, [player]);

  //sync expo-audio status with global state
  useEffect(() => {
    audio$.status.set(playerStatus);
  }, [playerStatus]);

  // React to changes in global state using useObserve
  useObserve(() => {
    const status = audio$.status.get();
    // Guard 1: If there's no status object yet, do nothing.
    if (!status) return;

    // Guard 2: If no track is loaded in the player,
    // our high-level state should be 'idle'.
    if (!status.isLoaded) {
      // Only set the state if it's not already idle to avoid unnecessary updates.
      if (audio$.playbackState.get() !== "idle") {
        audio$.playbackState.set("idle");
      }
      return; // Stop further processing.
    }

    if (status.didJustFinish) {
      audio$.playbackState.set("stopped");
      // Clear progress for the finished track
      const trackId = audio$.currentTrack.id.get();
      if (trackId) {
        audio$.progress[trackId].set(0);
      }
    } else if (status.playing) {
      audio$.playbackState.set("playing");
    } else if (status.isBuffering) {
      if (audio$.playbackState.get() !== "playing") {
        audio$.playbackState.set("loading");
      }
    }
  });

  // React to playback state changes to update media controls
  // useObserve(() => {
  //   const state = audio$.playbackState.get();
  //   const track = audio$.currentTrack.get();
  //
  //   if ((state === "playing" || state === "paused") && track) {
  //     MediaControls.updateNowPlaying({
  //       title: track.title,
  //       artist: track.artist,
  //       duration: track.duration,
  //       isPlaying: state === "playing",
  //     });
  //   } else {
  //     MediaControls.hideNowPlaying();
  //   }
  // });
  //

  //Loads a track into the native player but does NOT play it.
  const loadTrack = useCallback(
    (track: Track) => {
      if (!player || !track) return;
      audio$.error.set(null);
      try {
        console.log("Loading track into player:", track.title);
        player.replace({ uri: `${track.url}?utm_source=CustomPlayer7` });
        console.log("<-------------Track data sent to Omny Studio----------->");
        const resumePosition = audio$.progress[track.id].get() || 0;
        player.seekTo(resumePosition);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown playback error occured";
        console.error("Playback error: ", errorMessage);
        audio$.error.set(errorMessage);
        audio$.playbackState.set("error");
      }
    },
    [player],
  );

  //pre-load the track on startup
  useEffect(() => {
    const initialTrack = audio$.currentTrack.get();

    // If there's a track at the top of the queue after loading from storage...
    if (initialTrack) {
      console.log(
        "Pre-loading initial track on app start:",
        initialTrack.title,
      );
      // ...load it into the player so it's ready.
      loadTrack(initialTrack);
      // Set the state to paused, so the UI shows it's ready to be played.
      audio$.playbackState.set("paused");
    }
  }, [loadTrack]);

  //--- QUEUE CONTROL ---//

  const addToTopOfQueue = useCallback(
    (item: Track) => {
      // Get the current queue and filter out the item if it already exists.
      const currentQueue = audio$.queue.tracks.get();
      const newQueue = currentQueue.filter(
        (track: Track) => track.id !== item.id,
      );

      // Add the item to the very beginning of the new queue.
      newQueue.unshift(item);

      // Set the new queue state.
      audio$.queue.tracks.set(newQueue);

      // Since this is now the first item, load it into the player.
      loadTrack(item);
      // Set state to paused, making it "ready to play".
      audio$.playbackState.set("paused");
    },
    [loadTrack],
  );

  const addToBackOfQueue = useCallback(
    (item: Track) => {
      if (!audio$.queue.tracks.some((track) => track.id.get() === item.id)) {
        const wasQueueEmpty = audio$.queue.tracks.get().length === 0;
        audio$.queue.tracks.push(item);

        // If the queue was empty, this new track is now the first one.
        // Load it into the player so it's ready.
        if (wasQueueEmpty) {
          loadTrack(item);
          audio$.playbackState.set("paused");
        }
      } else {
        Alert.alert("Episode already in queue");
      }
    },
    [loadTrack],
  );

  const removeFromQueue = useCallback(
    (trackId: string) => {
      if (!player) return;

      // Get the current track *before* modifying the queue.
      const currentTrackBeforeRemoval = audio$.currentTrack.get();

      // Create the new queue by filtering out the track to be removed.
      const newQueue = audio$.queue.tracks
        .get()
        .filter((track) => track.id !== trackId);

      // Set the new state. This will trigger persistence hook automatically.
      audio$.queue.tracks.set(newQueue);

      // If the track just removed was the currently active one...
      if (currentTrackBeforeRemoval?.id === trackId) {
        player.replace(null); // Stop and unload the old audio.
        // Get the new track at the top of the queue (if it exists).
        const nextTrack = audio$.queue.tracks.get()[0];
        if (nextTrack) {
          // If there's a new track, load it and set the state to paused.
          loadTrack(nextTrack);
          audio$.playbackState.set("paused");
        } else {
          // If the queue is now empty, set the state to idle.
          audio$.playbackState.set("idle");
        }
      }
    },
    [player, loadTrack],
  );

  //--- Player Controls ---//

  const play = useCallback(
    (item: Track) => {
      if (!player) return;
      audio$.playbackState.set("loading");
      // First, ensure the track is at the top of the queue and loaded.
      addToTopOfQueue(item);
      // Then, simply tell the player to play.
      player.play();
    },
    [player, addToTopOfQueue],
  );

  const pause = useCallback(() => {
    if (player && audio$.playbackState.get() === "playing") {
      audio$.playbackState.set("paused");
      saveCurrentTrackProgress();
      player.pause();
    }
  }, [player, saveCurrentTrackProgress]);

  const resume = useCallback(() => {
    const state = audio$.playbackState.get();
    if (player && (state === "paused" || state === "stopped")) {
      if (state === "stopped") {
        player.seekTo(0);
      }
      // ✅ Optimistically set the state for instant UI feedback
      audio$.playbackState.set("playing");
      player.play();
    }
  }, [player]);

  const seekTo = useCallback(
    (seconds: number) => {
      if (player) {
        player.seekTo(seconds);
      }
    },
    [player],
  );

  return (
    <AudioContext.Provider
      value={{
        player,
        play,
        pause,
        resume,
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
