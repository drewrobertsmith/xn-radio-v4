// @/services/queue-initial-track.service.ts

import TrackPlayer, { type Track } from "react-native-track-player";

/**
 * A simple service whose only job is to add the default
 * track(s) to the player's queue. It does not manage state.
 */
export const QueueInitialTracksService = async (): Promise<void> => {
  const xnLogo = require("../assets/images/splash-icon.png");

  const XN_STREAM: Track = {
    id: "XNRD",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/XNRD.mp3",
    title: "XN Radio LIVE",
    artist: "XN Radio",
    artwork: xnLogo,
    isLiveStream: true,
  };

  // The service's ONLY responsibility:
  await TrackPlayer.add(XN_STREAM);

  // REMOVED: The redundant state synchronization.
  // The useSetupPlayer hook will handle this.
};
