import TrackPlayer, { type Track } from "react-native-track-player";

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

  await TrackPlayer.add([XN_STREAM]);
};
