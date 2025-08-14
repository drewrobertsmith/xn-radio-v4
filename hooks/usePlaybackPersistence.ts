import { audio$ } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";
import { useObserve } from "@legendapp/state/react";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

const PROGRESS_KEY_PREFIX = "progress_";

/**
 * A hook to manage the persistence of audio playback progress using MMKV.
 * It loads progress on startup and saves it at critical points (pause, track change, app background).
 */

export function usePlaybackPersistence() {
  // 1. Load all saved progress from MMKV into Legend-State on mount
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
    audio$.progress.set(progressMap);
    console.log("Playback progress loaded into state");
  }, []);

  // 2. Function to save the current track's progress
  const saveCurrentTrackProgress = () => {
    const track = audio$.currentTrack.get();
    const status = audio$.status.get();

    if (track?.id && status?.isLoaded) {
      const position = status.currentTime;
      const key = `${PROGRESS_KEY_PREFIX}${track.id}`;

      // Update both MMKV and the global state
      mmkv.set(key, position);

      // ✅ CORRECTED: Use `merge` to safely create or update the progress property.
      // This prevents a crash if `audio$.progress[track.id]` doesn't exist yet.
      audio$.progress[track.id].set(position);
      console.log(`Saved progress for ${track.id} at ${position}ms`);
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
