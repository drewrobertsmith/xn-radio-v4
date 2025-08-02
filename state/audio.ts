import { computed, observable } from "@legendapp/state";
import { AudioStatus } from "expo-audio";
import { Alert } from "react-native";

export interface Track {
  id: string;
  url: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  date?: string;
  artwork?: string;
  isLiveStream?: boolean;
  description?: string;
}

type PlaybackState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "stopped"
  | "error";

// The single, global audio state
export const audio$ = observable({
  currentTrack: null as Track | null,
  playbackState: "idle" as PlaybackState,
  status: null as AudioStatus | null,
  error: null as string | null,
  queue: {
    tracks: [] as Track[],
    total: () => {
      return audio$.queue.tracks.get().length;
    },
  },
});

export const addToTopOfQueue = (item: Track) => {
  //ensure no duplicates
  if (!audio$.queue.tracks.some((track) => track.id.get() === item.id)) {
    audio$.queue.tracks.unshift(item);
  }
};

export const addToBackOfQueue = (item: Track) => {
  //ensure no duplicates
  if (!audio$.queue.tracks.some((track) => track.id.get() === item.id)) {
    audio$.queue.tracks.push(item);
  } else {
    Alert.alert("Episode already in queue");
  }
};
