import { observable } from "@legendapp/state";
import { AudioStatus } from "expo-audio";

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
  playbackState: "idle" as PlaybackState,
  status: null as AudioStatus | null,
  progress: {} as Record<Track["id"], number>, // { [trackId]: positionInMs }
  error: null as string | null,
  queue: {
    tracks: [] as Track[],
    total: () => {
      return audio$.queue.tracks.get().length;
    },
  },
  // currentTrack is a computed function that automatically returns the first track
  // in the queue, or null if the queue is empty.
  // Any component observing this will automatically update when the queue changes.
  currentTrack: (): Track | null => {
    return audio$.queue.tracks.get()[0] || null;
  },
});
