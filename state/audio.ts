import { computed, observable } from "@legendapp/state";
import TrackPlayer, { State, Track } from "react-native-track-player";

//simple interface based on Event.PlaybackProgressUpdated's first three params
interface ProgressState {
  position: number;
  duration: number;
  buffered: number;
}

/* NOTE: Trackplayer is an "event-based" library that "pushes" its internal updates whereas a reactive library like legendState can't know about those updates unless we sync them. 
 So computed functions would only get the first update, RNTP would change and legendstate wouldnt update. The libraries need to be bridged.
 
playback.service.ts acts as the necessary bridge between the two paradigms:
1. It listens to the imperative, event-driven world of Track Player.
2. It translates those events into simple state mutations (.set()).
3. It pushes those mutations into the declarative, reactive world of Legend State.

This gives the best of both worlds:
- A Single Source of Truth: Audio$ store is always a perfect, up-to-date mirror of the player's state.
- Decoupling: UI components don't need to know that Track Player even exists. They just need to know how to read data from audio$. 
- Performance: Components will only re-render when the specific piece of state they care about (playerState, currentTrack, etc.) actually changes.
*/

export const audio$ = observable({
  /** The current playback state of the player (e.g., Playing, Paused, Buffering). */
  playerState: State.None as State,

  // /** The full track object that is currently active or loaded. Undefined if nothing is loaded. */
  // currentTrack: undefined as Track | undefined,

  /** The current queue of tracks in the player. */
  queue: {
    tracks: [] as Track[],
    total: computed((): number => {
      return audio$.queue.tracks.get().length;
    }),
  },

  currentTrack: computed((): Track | undefined => {
    return audio$.queue.tracks.get()[0] || null;
  }),

  /** The playback progress. Updated frequently during playback. */
  progress: {
    position: 0,
    duration: 0,
    buffered: 0,
  } as ProgressState,

  savedProgress: {} as Record<string, number>,

  /** Holds any fatal playback error messages. */
  error: null as string | null,
});
