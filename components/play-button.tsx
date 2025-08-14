import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import { useSelector } from "@legendapp/state/react";
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

  const { playbackState, currentTrackId } = useSelector(() => {
    const current = audio$.currentTrack.get(); // Get the whole object
    return {
      playbackState: audio$.playbackState.get(),
      // Safely get the id, returning null if no track exists
      currentTrackId: current ? current.id : null,
    };
  });

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

  const getIconName = () => {
    const isThisTrackPlaying =
      playbackState === "playing" && currentTrackId === track.id;

    if (isThisTrackPlaying) {
      return "pause-circle-filled";
    }
    // In all other cases (paused, stopped, loading, different track), show the play icon.
    // This provides immediate feedback when the user presses play on a different track.
    return "play-circle-filled";
  };
  // Show play icon for all other states
  return (
    <TouchableOpacity onPress={handleButtonPress}>
      <MaterialIcons
        name={getIconName()}
        size={size}
        color={color}
        suppressHighlighting={true}
      />
    </TouchableOpacity>
  );
}
