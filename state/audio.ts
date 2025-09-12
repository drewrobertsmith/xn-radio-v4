import { computed, observable } from "@legendapp/state";
import { AudioStatus } from "expo-audio";
import { State, Track } from "react-native-track-player";

interface ProgressState {
  position: number;
  duration: number;
  buffered: number;
}

export const audio$ = observable({
  playerState: State.None as State,

  progress: {
    position: 0,
    duration: 0,
    buffered: 0,
  } as ProgressState,

  savedProgress: {} as Record<string, number>,

  error: null as string | null,
});
