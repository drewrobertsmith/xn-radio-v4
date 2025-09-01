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
      await SetupService();
      if (!isMounted) return;

      // 1. Determine inital queue
      let initialQueue: Track[] = [];
      const savedQueueJSON = mmkv.getString(QUEUE_KEY);

      // 3. Decide the initial queue based on whether a saved queue exists.
      if (savedQueueJSON !== undefined) {
        // A queue HAS been saved before (even an empty one).
        // This is NOT a first launch.
        console.log("Found existing queue in storage. Loading it.");
        try {
          const savedTracks: Track[] = JSON.parse(savedQueueJSON);
          // Only add to the player if the queue isn't empty.
          if (Array.isArray(savedTracks) && savedTracks.length > 0) {
            initialQueue = savedTracks;
          }
        } catch (e) {
          console.error("Failed to parse saved queue, starting fresh.", e);
        }
      }

      // If, after trying to load, the queue is still empty, it's a first launch.
      if (initialQueue.length === 0) {
        console.log("No valid saved queue found. Adding initial track.");
        // This service should just return the track object, not add it.
        initialQueue = [await QueueInitialTracksService()];
      }

      // 2. Update the player first
      // Use `setQueue` for a clean reset, which is safer on startup than `add`.
      await TrackPlayer.setQueue(initialQueue);

      // 3. Set Legend State mirror to match EXACTLY what we just told the player.
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
