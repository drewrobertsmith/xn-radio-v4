import { useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";
import { QueueInitialTracksService } from "@/services/queue-initial-track.service";
import { SetupService } from "@/services/setup-track-player.service";

export function useSetupPlayer() {
  const [isPlayerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      // 1. Set up the player
      await SetupService();
      if (!isMounted) return;

      // 2. Check the queue
      const queue = await TrackPlayer.getQueue();
      if (!isMounted) return;

      // 3. Add initial tracks if the queue is empty
      if (queue.length <= 0) {
        await QueueInitialTracksService();
      }

      // 4. Signal that the player is ready
      setPlayerReady(true);
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  return isPlayerReady;
}
