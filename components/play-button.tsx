import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { use$ } from "@legendapp/state/react";
import { audio$, Track } from "@/state/audio";
import { XNTheme } from "./ui/theme-provider";
import { useAudio } from "@/context/audio-context";

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
};

export default function PlayButton({ size, track, color }: PlayButtonProps) {
  const { play, pause, resume } = useAudio();

  const { playbackState, currentTrackId } = use$(() => {
    const currentTrack = audio$.currentTrack.get(); // Get the whole object
    return {
      playbackState: audio$.playbackState.get(),
      // Safely get the id, returning null if no track exists
      currentTrackId: currentTrack ? currentTrack.id : null,
    };
  });

  console.log("Play Button: ", playbackState);

  // If there's no track associated with this button, render nothing.
  if (!track) {
    return null;
  }

  const handleButtonPress = () => {
    const isThisTrackPlaying =
      playbackState === "playing" && currentTrackId === track.id;
    const isThisTrackPaused =
      playbackState === "paused" && currentTrackId === track.id;

    if (isThisTrackPlaying) {
      // If this exact track is playing, pause it.
      pause();
    } else if (isThisTrackPaused) {
      // If this exact track is paused, resume it.
      resume();
    } else {
      // For all other cases (different track, idle, stopped), play this track.
      play(track);
    }
  };

  const renderIcon = () => {
    const isThisTrackCurrent = currentTrackId === track.id;

    // If this specific track is the one loading, show a spinner.
    if (playbackState === "loading" && isThisTrackCurrent) {
      return <ActivityIndicator size={size} color={color} />;
    }

    // If this specific track is playing, show the pause icon.
    if (playbackState === "playing" && isThisTrackCurrent) {
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
      disabled={playbackState === "loading" && currentTrackId === track.id}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
}
