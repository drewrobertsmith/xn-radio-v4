import { audio$, Track } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";
import { useObserve } from "@legendapp/state/react";
import { useEffect, useRef } from "react";

// store the entire queue under one single, well-known key.
const QUEUE_KEY = "audio_queue";

/**
 * A hook to manage the persistence of the audio queue using MMKV.
 * It loads the queue on startup and saves it whenever it changes.
 */

export function useQueuePersistence() {
  // Create a ref to track if this is the initial mount.
  const isInitialMount = useRef(true);

  // 1. Load the saved queue from MMKV into Legend-State on mount

  useEffect(() => {
    const queueJson = mmkv.getString(QUEUE_KEY);

    if (queueJson) {
      try {
        // Parse the JSON string back into an array of Track objects
        const savedQueue: Track[] = JSON.parse(queueJson);
        if (Array.isArray(savedQueue)) {
          audio$.queue.tracks.set(savedQueue);
          console.log("Audio queue loaded from storage");
        }
      } catch (e) {
        console.error("Failed to parse saved audio queue: ", e);
        //Clear corrupted key if parsing fails
        mmkv.delete(QUEUE_KEY);
      }
    }
  }, []);

  // 2. Function to save the current queue array to MMKV
  const saveCurrentQueue = () => {
    const queue = audio$.queue.tracks.get();

    // Save the queue even if it's empty. This is important for when
    // the user clears their queue and expects it to be empty on next launch.
    const queueJson = JSON.stringify(queue);
    mmkv.set(QUEUE_KEY, queueJson);
    // We don't need to set the audio$ state here, as this function
    // is only called in response to the state already changing.
  };

  // 3. Observe the queue state and save it whenever it changes
  useObserve(() => {
    // By getting the tracks here, we tell useObserve to run this
    // effect whenever the tracks array changes (add, remove, reorder).

    audio$.queue.tracks.get();

    //Check if it's the initial mount.
    if (isInitialMount.current) {
      // If it is, set the ref to false and do nothing else.
      // This skips the save operation on the first run.
      isInitialMount.current = false;
    } else {
      // On all subsequent runs (i.e., actual queue changes), save the queue.
      saveCurrentQueue();
      console.log("Queue changed, saving to MMKV.");
    }
  });
  return { saveCurrentQueue };
}
