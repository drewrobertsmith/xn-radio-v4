import {
  AudioPlayer,
  AudioStatus,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, {
  createContext,
  SetStateAction,
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

interface AudioContextType {
  player: AudioPlayer;
  play: (item: Track) => void;
  pause: () => void;
  status: AudioStatus | null;
  currentSource: Track | null;
  setCurrentSource: React.Dispatch<SetStateAction<Track | null>>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const [currentSource, setCurrentSource] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const status = playerStatus;

  const play = (item: Track) => {
    try {
      if (!player) {
        console.log("Player not available");
        return;
      }

      setIsLoading(true);
      setCurrentSource(item);
      console.log("Playing: ", item);
      player.replace({ uri: item.url });
      player.play();
    } catch (error) {
      console.error("Playback error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pause = () => {
    try {
      if (player && player.playing) {
        player.pause();
      }
    } catch (error) {
      console.error("Error Pausing: ", error);
    }
  };

  useEffect(() => {
    return () => {
      if (!player) return;

      try {
        console.log("tryign ot remove player: ", player);
        player.remove();
      } catch (error) {
        console.log("Player cleanup error: ", error);
      }
    };
  }, [player]);

  return (
    <AudioContext.Provider
      value={{
        player,
        play,
        pause,
        status,
        currentSource,
        setCurrentSource,
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
