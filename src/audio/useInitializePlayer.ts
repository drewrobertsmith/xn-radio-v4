import { useEffect, useState } from "react";
import { SetupServiceWithOptions } from "./setup-trackplayer";
import TrackPlayer from "react-native-track-player";
import { QueueDefaultTrack } from "./queue-default-track";

export default function useInitializePlayerWithInitialQueue() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupServiceWithOptions();
      if (unmounted) return;
      setIsPlayerReady(true);
      const queue = await TrackPlayer.getQueue();
      if (unmounted) return;
      if (queue.length <= 0) {
        console.log("No Queue. Loading Default Track");
        await QueueDefaultTrack();
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return isPlayerReady;
}
