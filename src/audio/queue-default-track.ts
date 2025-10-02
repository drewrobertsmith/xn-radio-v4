import { Image } from "react-native";
import { type Track } from "react-native-track-player";

export const QueueDefaultTrack = async (): Promise<Track> => {
  const xnLogo = require("../../assets/images/splash-icon.png");
  // Resolve the asset to get its properties, including the URI
  const resolvedArtwork = Image.resolveAssetSource(xnLogo);

  const XN_STREAM: Track = {
    id: "XNRD",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/XNRD.mp3",
    title: "XN Radio LIVE",
    artist: "XN Radio",
    // artwork: resolvedArtwork.uri,
    isLiveStream: true,
  };

  return XN_STREAM;
};
