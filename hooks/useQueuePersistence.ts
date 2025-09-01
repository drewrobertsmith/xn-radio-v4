import { audio$ } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";
import { useObserve } from "@legendapp/state/react";
import { useRef } from "react";

const QUEUE_KEY = "audio_queue";

/**
 * A hook to manage the persistence of the audio queue using MMKV.
 * Its ONLY job is to watch the global queue state and save it when it changes.
 * The loading of the queue is handled by the useSetupPlayer hook.
 */
export function useQueuePersistence() {
  // A ref to prevent saving on the very first render before setup is complete.
  const isReadyForSaving = useRef(false);

  // Observe the queue state and save it whenever it changes.
  useObserve(() => {
    // Get the tracks array. This creates the subscription.
    // effect whenever the queue array changes (add, remove, reorder).
    const tracks = audio$.queue.tracks.get();

    // On the first run, isReadyForSaving.current is false, so we do nothing.
    // After the initial state is set by useSetupPlayer, this will run again,
    // and from then on, it will save all subsequent changes.
    if (isReadyForSaving.current) {
      console.log("Queue changed, saving to MMKV.");
      const queueJson = JSON.stringify(tracks);
      mmkv.set(QUEUE_KEY, queueJson);
    }

    // After the first run, we are ready to save any future changes.
    isReadyForSaving.current = true;
  });
}
