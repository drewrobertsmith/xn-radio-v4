import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native";
import { useSelector } from "@legendapp/state/react";
import { addToTopOfQueue, audio$, Track } from "@/state/audio";
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
  // Note: I'm using `useAudioControls` as we defined in the refactor.
  // If you named it `useAudio`, that's fine too.
  const { play, pause, resume } = useAudio();

  // ✅ The Corrected, Null-Safe Selector
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
    if (playbackState === "playing" && currentTrackId === track.id) {
      pause();
    } else if (playbackState === "paused" && currentTrackId === track.id) {
      resume();
    } else if (playbackState === "playing" && currentTrackId !== track.id) {
      pause(); //add a pause before the replacement
      play(track);
    } else {
      play(track);
    }
  };

  const getIcon = () => {
    // Show loading indicator if loading this specific track
    if (playbackState === "loading" && currentTrackId === track.id) {
      return <ActivityIndicator size={size} color={color} />;
    }

    // Show pause icon if playing this specific track
    if (playbackState === "playing" && currentTrackId === track.id) {
      return (
        <MaterialIcons
          name="pause-circle-filled"
          size={size}
          color={color}
          onPress={handleButtonPress}
          suppressHighlighting={true}
        />
      );
    }

    // Show play icon for all other states
    return (
      <MaterialIcons
        name="play-circle-filled"
        size={size}
        color={color}
        onPress={handleButtonPress}
        suppressHighlighting={true}
      />
    );
  };

  return getIcon();
}
