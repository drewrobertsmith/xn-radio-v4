import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { XNTheme } from "./ui/theme-provider";
import {
  State,
  Track,
  useActiveTrack,
  usePlaybackState,
} from "react-native-track-player";
import { useAudio } from "../context/audio-context";

type PlayButtonProps = {
  size: number;
  // The track prop can sometimes be null when the parent is loading
  track: Track | null;
  color: XNTheme["colors"][
    | "background"
    | "border"
    | "card"
    | "notification"
    | "primary"
    | "secondary"
    | "secondaryText"
    | "text"];
  isLiveStream?: boolean;
};

export default function PlayButton({
  size,
  track,
  color,
  isLiveStream,
}: PlayButtonProps) {
  const { play, pause, stop } = useAudio();
  const playbackState = usePlaybackState();
  const activeTrack = useActiveTrack();

  // If there's no track associated with this button, render nothing.
  if (!track) {
    return null;
  }

  const isThisTrackCurrent = activeTrack?.id === track.id;
  const isThisTrackPlaying =
    playbackState.state === State.Playing && isThisTrackCurrent;
  const isThisTrackLoading =
    playbackState.state === State.Loading && isThisTrackCurrent;
  const isThisTrackBuffering =
    playbackState.state === State.Buffering && isThisTrackCurrent;
  const isThisTrackReady =
    playbackState.state === State.Ready && isThisTrackCurrent;

  const handleButtonPress = () => {
    // Case 1: This specific track is currently playing.
    if (isThisTrackPlaying) {
      // If it's playing, we decide whether to stop or pause.
      if (isLiveStream) {
        stop();
      } else {
        pause();
      }
    }
    // Case 2: This track is NOT playing (it's paused, stopped, idle, or a different track is playing).
    else {
      // In all other cases, the desired action is to start playing this track.
      play(track);
    }
  };
  const renderIcon = () => {
    if (isLiveStream && (isThisTrackLoading || isThisTrackBuffering)) {
      return <MaterialIcons name="stop-circle" size={size} color={color} />;
    }

    if (!isLiveStream && (isThisTrackLoading || isThisTrackBuffering)) {
      return (
        <MaterialIcons name="pause-circle-filled" size={size} color={color} />
      );
    }

    if (isThisTrackPlaying) {
      const iconName = isLiveStream ? "stop-circle" : "pause-circle-filled";
      return <MaterialIcons name={iconName} size={size} color={color} />;
    }

    // Default case for paused, stopped, idle, etc.
    return (
      <MaterialIcons name="play-circle-filled" size={size} color={color} />
    );
  };

  return (
    <TouchableOpacity onPress={handleButtonPress} disabled={isThisTrackLoading}>
      {renderIcon()}
    </TouchableOpacity>
  );
}
