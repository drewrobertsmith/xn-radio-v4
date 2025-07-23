import {
  AudioPlayer,
  AudioStatus,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  date?: string;
  artwork?: string;
  isLiveStream?: boolean;
}

type PlaybackState =
  | "idle" // Not loaded, no track selected
  | "loading" // Loading a new track
  | "playing" // Actively playing
  | "paused" // Paused
  | "stopped" // Finished playing
  | "error"; // An error occurred

interface AudioContextType {
  player: AudioPlayer;
  play: (item: Track) => void;
  pause: () => void;
  resume: () => void;
  seekTo: (seconds: number) => void;
  status: AudioStatus | null;
  currentTrack: Track | null;
  playbackState: PlaybackState;
  error: string | null;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [error, setError] = useState<string | null>(null);

  // This useEffect listens to the low-level status from expo-audio and updates
  // high-level playbackState accordingly.

  useEffect(() => {
    if (!playerStatus) return;

    //order is key here
    if (playerStatus.didJustFinish) {
      setPlaybackState("stopped");
    } else if (
      playerStatus.isBuffering &&
      playbackState !== "idle" &&
      playbackState !== "error"
    ) {
      setPlaybackState("loading");
    } else if (playerStatus.playing && playbackState !== "paused") {
      setPlaybackState("playing");
    }
    // Note: We intentionally don't set 'paused' here automatically.
    // The pause() and play() actions will manage the paused state explicitly.
  }, [playerStatus, playbackState]);

  const play = useCallback(
    (item: Track) => {
      if (!player) return;

      //Reset any previous errors
      setError(null);
      // Set our high-level state to loading immediately for responsive UI
      setPlaybackState("loading");
      setCurrentTrack(item);

      try {
        console.log("Replacing and playing:", item.title);
        // *** FIX for Race Condition ***
        // Use the `item` passed directly into the function, NOT the `currentSource` state.
        player.replace({ uri: item.url });
        player.play();
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown playback error occured";
        console.error("Playback error: ", errorMessage);
        setError(errorMessage);
        setPlaybackState("error");
      }
    },
    [player],
  );

  const pause = useCallback(() => {
    if (player && playbackState === "playing") {
      player.pause();
      setPlaybackState("paused");
    }
  }, [player, playbackState]);

  const resume = useCallback(() => {
    if (player && (playbackState === "paused" || playbackState === "stopped")) {
      // If stopped, we need to seek to the beginning before playing again.
      if (playbackState === "stopped") {
        player.seekTo(0);
      }
      player.play();
      setPlaybackState("playing");
    }
  }, [player, playbackState]);

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
        status: playerStatus,
        currentTrack,
        playbackState,
        error,
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
