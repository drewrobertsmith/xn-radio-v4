import { Track, useAudio } from "@/context/audio-context";
import { XNTheme } from "./ui/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

type QueueButtonProps = {
  item: Track;
  size: number;
  color: string;
};

export default function QueueButton({ item, size, color }: QueueButtonProps) {
  const { queue$ } = useAudio();

  return (
    <View>
      <TouchableOpacity onPress={queue$.addToQueue(item)}>
        <MaterialIcons name="playlist-add" size={size} color={color} />
      </TouchableOpacity>
    </View>
  );
}
