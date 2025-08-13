import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { audio$, Track } from "@/state/audio";
import { useSelector } from "@legendapp/state/react";
import { useAudio } from "@/context/audio-context";
import { useAppTheme } from "./ui/theme-provider";

type QueueButtonProps = {
  item: Track;
  size: number;
};

export default function QueueButton({ item, size }: QueueButtonProps) {
  const { colors } = useAppTheme();
  const { queue } = useSelector(() => {
    return {
      queue: audio$.queue.tracks.get(),
    };
  });
  const { addToBackOfQueue } = useAudio();

  const handleQueueIconState = () => {
    if (!queue.some((track) => track.id === item.id)) {
      return (
        <MaterialIcons name="playlist-add" size={size} color={colors.text} />
      );
    } else {
      return (
        <MaterialIcons
          name="playlist-remove"
          size={size}
          color={colors.error}
        />
      );
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          addToBackOfQueue(item);
        }}
      >
        {handleQueueIconState()}
      </TouchableOpacity>
    </View>
  );
}
