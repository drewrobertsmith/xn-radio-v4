import { audio$ } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";
import { useObserve } from "@legendapp/state/react";

const QUEUE_KEY = "audio_queue";

/**
 * A hook to manage the persistence of the audio queue using MMKV.
 * Its ONLY job is to watch the global queue state and save it when it changes.
 * The loading of the queue is handled by the useSetupPlayer hook.
 */
export function useQueuePersistence() {
  // Observe the queue state and save it whenever it changes.
  useObserve(() => {
    // By getting the queue here, we tell useObserve to run this
    // effect whenever the queue array changes (add, remove, reorder).
    const queue = audio$.queue.tracks.get();

    // Save the queue even if it's empty. This is important for when
    // the user clears their queue and expects it to be empty on next launch.
    const queueJson = JSON.stringify(queue);
    mmkv.set(QUEUE_KEY, queueJson);
    console.log("Queue changed, saving to MMKV.");
  });
}
