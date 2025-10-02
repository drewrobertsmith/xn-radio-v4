import React, { createContext, useCallback, useContext } from "react";
import { usePlaybackPersistence } from "@/hooks/usePlaybackPersistence";
import { useQueuePersistence } from "@/hooks/useQueuePersistence";
import TrackPlayer, { Track } from "react-native-track-player";

// The context now just provides the player instance and actions
interface AudioContextType {
  play: (item: Track) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  // seekTo: (seconds: number) => void;
  // playNextInQueue: (item: Track) => void;
  // addToBackOfQueue: (item: Track) => void;
  // removeFromQueue: (trackId: string) => void;
  // saveCurrentTrackProgress: () => void;
  // clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  // const { saveCurrentTrackProgress } = usePlaybackPersistence();
  // useQueuePersistence();

  //--- Player Controls ---//

  const play = async (item: Track) => {
    await TrackPlayer.load(item);
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const stop = async () => {
    await TrackPlayer.stop();
  };

  return (
    <AudioContext.Provider
      value={{
        play,
        pause,
        stop,
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
