import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { audio$, Track } from "@/state/audio";
import { use$ } from "@legendapp/state/react";
import { useAudio } from "@/context/audio-context";
import { useAppTheme } from "./ui/theme-provider";

type QueueButtonProps = {
  item: Track;
  size: number;
};

export default function QueueButton({ item, size }: QueueButtonProps) {
  const { colors } = useAppTheme();
  const isInQueue = use$(() =>
    audio$.queue.tracks.get().some((track) => track.id === item.id),
  );
  const { addToBackOfQueue, removeFromQueue } = useAudio();

  const handleQueueIconPress = () => {
    if (!isInQueue) {
      addToBackOfQueue(item);
    } else {
      removeFromQueue(item.id);
    }
  };

  const handleQueueIconState = () => {
    if (!isInQueue) {
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
          handleQueueIconPress();
        }}
      >
        {handleQueueIconState()}
      </TouchableOpacity>
    </View>
  );
}
