import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { use$ } from "@legendapp/state/react";
import { XNTheme } from "./ui/theme-provider";
import { useAudio } from "@/context/audio-context";
import TrackPlayer, { State, Track } from "react-native-track-player";
import { audio$ } from "@/state/audio";

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
  isLiveStream: boolean;
};

export default function PlayButton({
  size,
  track,
  color,
  isLiveStream,
}: PlayButtonProps) {
  const { play, pause, stop } = useAudio();

  const { playbackState, currentTrackId } = use$(() => {
    const currentTrack = audio$.currentTrack.get(); // Get the whole object
    return {
      playbackState: audio$.playerState.get(),
      // Safely get the id, returning null if no track exists
      currentTrackId: currentTrack ? currentTrack.id : null,
    };
  });

  // If there's no track associated with this button, render nothing.
  if (!track) {
    return null;
  }

  const handleButtonPress = () => {
    const isThisTrackPlaying =
      playbackState === State.Playing && currentTrackId === track.id;
    const isThisTrackPaused =
      playbackState === State.Paused && currentTrackId === track.id;

    if (isThisTrackPlaying) {
      // If this exact track is playing, pause it.
      pause();
    } else if (isThisTrackPaused && isLiveStream) {
      stop();
    } else {
      // For all other cases (different track, idle, stopped), play this track.
      play(track);
    }
  };

  const renderIcon = () => {
    const isThisTrackCurrent = currentTrackId === track.id;

    // If this specific track is the one loading, show a spinner.
    if (playbackState === State.Loading && isThisTrackCurrent) {
      return <ActivityIndicator size={size} color={color} />;
    } else if (
      playbackState === State.Playing &&
      isThisTrackCurrent &&
      isLiveStream
    ) {
      return <MaterialIcons name="stop-circle" size={size} color={color} />;
    }

    // If this specific track is playing, show the pause icon.
    else if (playbackState === State.Playing && isThisTrackCurrent) {
      return (
        <MaterialIcons name="pause-circle-filled" size={size} color={color} />
      );
    }

    // In all other cases (paused, stopped, different track), show the play icon.
    return (
      <MaterialIcons name="play-circle-filled" size={size} color={color} />
    );
  };

  return (
    <TouchableOpacity
      onPress={handleButtonPress}
      disabled={playbackState === State.Loading && currentTrackId === track.id}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
}
