import { Track, useAudio } from "@/context/audio-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native";
import { XNTheme } from "./ui/theme-provider";

type PlayButtonProps = {
  size: number;
  track?: Track;
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
  const { playbackState, currentTrack, play, pause, resume } = useAudio();

  // Correct, robust logic for handling button presses
  const handleButtonPress = (track: Track) => {
    if (playbackState === "playing" && currentTrack?.id === track.id) {
      pause();
    } else if (playbackState === "paused" && currentTrack?.id === track.id) {
      resume();
    } else {
      play(track);
    }
  };

  // A function to determine which icon to show.
  const getIcon = () => {
    // Show loading indicator if loading this specific track
    if (playbackState === "loading" && currentTrack?.id === track?.id) {
      return <ActivityIndicator size={size} color={color} />;
    }

    // Show pause icon if playing this specific track
    if (playbackState === "playing" && currentTrack?.id === track?.id) {
      return (
        <MaterialIcons
          name="pause-circle-filled"
          size={size}
          color={color}
          onPress={() => handleButtonPress(track)}
        />
      );
    }

    // Show play icon for all other states (idle, paused, stopped, or different track)
    return (
      <MaterialIcons
        name="play-circle-filled"
        size={size}
        color={color}
        onPress={() => handleButtonPress(track)}
      />
    );
  };

  return getIcon();
}
