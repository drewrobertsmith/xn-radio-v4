// @/hooks/useSetupPlayer.ts

import { useEffect, useState } from "react";
import TrackPlayer, { Track } from "react-native-track-player";
import { QueueInitialTracksService } from "@/services/queue-initial-track.service";
import { SetupService } from "@/services/setup-track-player.service";
import { audio$ } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";

const QUEUE_KEY = "audio_queue"; // Ensure this key is consistent

export function useSetupPlayer() {
  const [isPlayerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      // 1. Basic player setup (no changes here)
      await SetupService();
      if (!isMounted) return;

      // 2. Check storage for a previously saved queue.
      const savedQueueJSON = mmkv.getString(QUEUE_KEY);

      // 3. Decide the initial queue based on whether a saved queue exists.
      if (savedQueueJSON !== undefined) {
        // A queue HAS been saved before (even an empty one).
        // This is NOT a first launch.
        console.log("Found existing queue in storage. Loading it.");
        try {
          const savedQueue: Track[] = JSON.parse(savedQueueJSON);
          // Only add to the player if the queue isn't empty.
          if (savedQueue.length > 0) {
            await TrackPlayer.add(savedQueue);
          }
        } catch (e) {
          console.error("Failed to parse saved queue, starting fresh.", e);
        }
      } else {
        // The queue key does NOT exist in storage.
        // This is a TRUE first launch.
        console.log("No saved queue found. Adding initial track.");
        await QueueInitialTracksService();
      }

      // 4. Final Synchronization Step
      // Get the definitive queue from the player (whatever it ended up being)
      // and set it as our reactive state. This is the single source of truth.
      const finalQueue = await TrackPlayer.getQueue();
      if (!isMounted) return;
      audio$.queue.tracks.set(finalQueue);

      setPlayerReady(true);
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  return isPlayerReady;
}
