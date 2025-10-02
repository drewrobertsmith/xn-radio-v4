import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { use$ } from "@legendapp/state/react";
import { useAppTheme } from "./ui/theme-provider";
import { Track } from "react-native-track-player";
import { useAudio } from "../context/audio-context";

type QueueButtonProps = {
  item: Track;
  size: number;
};

export default function QueueButton({ item, size }: QueueButtonProps) {
  const { colors } = useAppTheme();
  // const isInQueue = use$(() =>
  //   audio$.queue.tracks.get().some((track) => track.id === item.id),
  // );
  // const { addToBackOfQueue, removeFromQueue } = useAudio();

  const handleQueueIconPress = () => {
    // if (!isInQueue) {
    //   console.log("not in queue, adding to back of queue");
    //   addToBackOfQueue(item);
    // } else {
    //   //this is not being fired
    //   console.log("already in queue, removing")
    //   removeFromQueue(item.id);
    // }
  };

  const handleQueueIconState = () => {
    // if (!isInQueue) {
    //   return (
    //     <MaterialIcons name="playlist-add" size={size} color={colors.text} />
    //   );
    // } else {
    //   return (
    //     <MaterialIcons
    //       name="playlist-remove"
    //       size={size}
    //       color={colors.error}
    //     />
    //   );
    // }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          handleQueueIconPress();
        }}
      >
        {/* {handleQueueIconState} */}
      </TouchableOpacity>
    </View>
  );
}
