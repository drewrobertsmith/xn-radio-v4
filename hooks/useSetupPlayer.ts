import { useEffect, useState } from "react";
import TrackPlayer, { Track } from "react-native-track-player";
import { QueueInitialTracksService } from "@/services/queue-initial-track.service";
import { SetupService } from "@/services/setup-track-player.service";
import { audio$ } from "@/state/audio";
import { mmkv } from "@/utils/mmkv-storage";

const QUEUE_KEY = "audio_queue";

export function useSetupPlayer() {
  const [isPlayerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      // 1. Basic player setup
      await SetupService();
      if (!isMounted) return;

      // 2. Determine the definitive initial queue
      let initialQueue: Track[] = [];
      const savedQueueJSON = mmkv.getString(QUEUE_KEY);

      // The primary condition is the EXISTENCE of the key.
      if (savedQueueJSON !== undefined) {
        // A queue HAS been saved before (even an empty one). This is a returning user.
        console.log("Found existing queue in storage. Loading it.");
        try {
          const savedTracks = JSON.parse(savedQueueJSON);
          if (Array.isArray(savedTracks)) {
            initialQueue = savedTracks;
          }
          console.log("Saved queue is: ", initialQueue);
        } catch (e) {
          console.error("Failed to parse saved queue, starting fresh.", e);
        }
      } else {
        // The queue key does NOT exist. This is a TRUE first launch.
        console.log("No saved queue found. Adding initial track.");
        initialQueue = [await QueueInitialTracksService()];
      }

      // 3. Command both systems with our definitive queue
      if (initialQueue.length > 0) {
        // Use `setQueue` for a clean reset, which is safer on startup.
        await TrackPlayer.setQueue(initialQueue);
      }

      // Set our Legend State mirror to match EXACTLY what we just decided.
      if (!isMounted) return;
      audio$.queue.tracks.set(initialQueue);

      setPlayerReady(true);
    }

    setup();
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  return isPlayerReady;
}
