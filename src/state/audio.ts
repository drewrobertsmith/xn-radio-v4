// import { computed, observable } from "@legendapp/state";
// import { State, Track } from "react-native-track-player";
//
// //simple interface based on Event.PlaybackProgressUpdated's first three params
// interface ProgressState {
//   position: number;
//   duration: number;
//   buffered: number;
// }
//
// export const audio$ = observable({
//   /** The current playback state of the player (e.g., Playing, Paused, Buffering). */
//   playerState: State.None as State,
//
//   /** The full track object that is currently active or loaded. Undefined if nothing is loaded. */
//   currentTrack: undefined as Track | undefined,
//
//   /** The current queue of tracks in the player. */
//   queue: {
//     tracks: [] as Track[],
//     total: computed((): number => {
//       return audio$.queue.tracks.get().length;
//     }),
//   },
//   /** The playback progress. Updated frequently during playback. */
//   progress: {
//     position: 0,
//     duration: 0,
//     buffered: 0,
//   } as ProgressState,
//
//   savedProgress: {} as Record<string, number>,
//
//   /** Holds any fatal playback error messages. */
//   error: null as string | null,
// });
