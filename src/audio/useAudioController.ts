import TrackPlayer, { Track } from "react-native-track-player";

export function useAudioController() {
  const play = async (item: Track) => {
    TrackPlayer.load(item);
    TrackPlayer.play();
  };

  const pause = async () => {
    TrackPlayer.pause();
  };

  const stop = async () => {
    TrackPlayer.stop();
  };

  return {
    play,
    pause,
    stop,
  };
}
