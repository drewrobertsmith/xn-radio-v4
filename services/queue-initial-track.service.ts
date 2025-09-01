import { Image } from "react-native";
import { type Track } from "react-native-track-player";

/**
 * A simple service whose only job is to add the default
 * track(s) to the player's queue. It does not manage state.
 */
export const QueueInitialTracksService = async (): Promise<Track> => {
  const xnLogo = require("../assets/images/splash-icon.png");
  // Resolve the asset to get its properties, including the URI
  const resolvedArtwork = Image.resolveAssetSource(xnLogo);

  const XN_STREAM: Track = {
    id: "XNRD",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/XNRD.mp3",
    title: "XN Radio LIVE",
    artist: "XN Radio",
    artwork: resolvedArtwork.uri,
    isLiveStream: true,
  };

  return XN_STREAM;
};
