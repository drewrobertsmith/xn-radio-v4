import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { usePlaybackPersistence } from "@/hooks/usePlaybackPersistence";
import { useQueuePersistence } from "@/hooks/useQueuePersistence";
import { Track } from "react-native-track-player";

// The context now just provides the player instance and actions
interface AudioContextType {
  play: (item: Track) => void;
  pause: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  // const { saveCurrentTrackProgress } = usePlaybackPersistence();
  // useQueuePersistence();

  const play = (item: Track) => {};
  const pause = () => {};

  return (
    <AudioContext.Provider
      value={{
        play,
        pause,
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
