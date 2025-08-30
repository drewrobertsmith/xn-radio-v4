import { audio$ } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";
import { useObserve } from "@legendapp/state/react";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

const PROGRESS_KEY_PREFIX = "progress_";

/**
 * A hook to manage the persistence of audio playback progress using MMKV.
 * It loads progress on startup and saves it at critical points (pause, track change, app background).
 * The loading of progress is handled by the AudioProvider's play function.
 */

export function usePlaybackPersistence() {
  // 1. Load all saved progress from MMKV into our new state property on mount.
  useEffect(() => {
    const allKeys = mmkv.getAllKeys();
    const progressKeys = allKeys.filter((key) =>
      key.startsWith(PROGRESS_KEY_PREFIX),
    );

    const progressMap: Record<string, number> = {};
    for (const key of progressKeys) {
      const trackId = key.replace(PROGRESS_KEY_PREFIX, "");
      const position = mmkv.getNumber(key);
      if (trackId && typeof position === "number") {
        progressMap[trackId] = position;
      }
    }
    // Set the entire map in our global state.
    audio$.savedProgress.set(progressMap);
    console.log("All saved playback progress loaded into state.");
  }, []);

  // 2. Update the save function to write to both MMKV and the state.
  const saveCurrentTrackProgress = () => {
    const track = audio$.currentTrack.get();
    const position = audio$.progress.position.get();

    if (track?.id && position > 0) {
      const key = `${PROGRESS_KEY_PREFIX}${track.id}`;
      // a. Write to persistent storage
      mmkv.set(key, position);
      // b. Update our reactive state map so the UI updates instantly
      audio$.savedProgress[track.id].set(position);
    }
  };
  // 3. Observe state to save progress on track changes or pause
  useObserve(() => {
    // This effect runs whenever the current track ID changes.
    // useEffect` pattern inside `useObserve` for cleanup
    audio$.currentTrack.id.get();
    return () => {
      // This cleanup function runs when the ID is about to change.
      // This is the perfect time to save the progress of the *previous* track.
      saveCurrentTrackProgress();
    };
  });

  // 4. Save progress when the app goes into the background
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState.match(/inactive|background/)) {
          saveCurrentTrackProgress();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  //return the save function if we need to trigger it manually, e.g., on pause.
  return { saveCurrentTrackProgress };
}
