import { Track, useAudio } from "@/context/audio-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme, XNTheme } from "./ui/theme-provider";
import { Clip, Station } from "@/types/types";

type PlayButtonProps = {
  track: Track | null;
  size: number;
  color: string;
  item?: Clip | Station;
};

export default function PlayButton({
  track,
  size,
  color,
  item,
}: PlayButtonProps) {
  const player = useAudio();

  let iconState =
    player.status?.playing && player.currentSource?.id === item?.Id
      ? "pause-circle-filled"
      : "play-circle-filled";
  if (player.status?.isBuffering) {
    iconState = "pending";
  }

  const handlePlayPausePress = (track: Track) => {
    if (player.status?.playing) {
      player.pause();
    } else if (player.status?.isBuffering) {
      return;
    } else {
      player.play(track);
    }
  };

  return (
    <MaterialIcons
      name={
        iconState as "pause-circle-filled" | "play-circle-filled" | "pending"
      }
      size={size}
      color={color}
      onPress={() => {
        handlePlayPausePress(track);
      }}
    />
  );
}
