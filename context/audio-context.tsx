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

// The context now just provides the player instance and actions
interface AudioContextType {
  player: AudioPlayer;
  play: (item: Track) => void;
  pause: () => void;
  resume: () => void;
  seekTo: (seconds: number) => void;
  addToTopOfQueue: (item: Track) => void;
  addToBackOfQueue: (item: Track) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);

  console.log("playback: ", audio$.playbackState.get());
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
  }, []);

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

  //--- QUEUE CONTROL ---//

  const addToTopOfQueue = useCallback((item: Track) => {
    //ensure no duplicates
    if (!audio$.queue.tracks.some((track) => track.id.get() === item.id)) {
      audio$.queue.tracks.unshift(item);
    }
  }, []);

  const addToBackOfQueue = useCallback((item: Track) => {
    //ensure no duplicates
    if (!audio$.queue.tracks.some((track) => track.id.get() === item.id)) {
      audio$.queue.tracks.push(item);
    } else {
      Alert.alert("Episode already in queue");
    }
  }, []);

  //--- Player Controls ---//

  const play = useCallback(
    (item: Track) => {
      if (!player) return;
      audio$.error.set(null);
      // //optimistically set state for better UI responsiveness
      // audio$.playbackState.set("playing");
      audio$.currentTrack.set(item);
      try {
        console.log("Replacing and playing:", item.title);
        addToTopOfQueue(item);
        // *** FIX for Race Condition ***
        // Use the `item` passed directly into the function, NOT the `currentSource` state.
        player.replace({ uri: item.url });
        player.play();
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown playback error occured";
        console.error("Playback error: ", errorMessage);
        audio$.error.set(errorMessage);
        audio$.playbackState.set("error");
      }
    },
    [player, addToTopOfQueue],
  );

  const pause = useCallback(() => {
    if (player && audio$.playbackState.get() === "playing") {
      audio$.playbackState.set("paused");
      player.pause();
    }
  }, [player]);

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
        player.seekTo(seconds); // expo-audio uses milliseconds
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
