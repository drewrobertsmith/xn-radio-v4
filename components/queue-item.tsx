import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { formatDate, formatDuration } from "@/utils/formatters";
import { Image } from "expo-image";
import { audio$, Track } from "@/state/audio";
import { useAudio } from "@/context/audio-context";
import { useObserve, useSelector, use$ } from "@legendapp/state/react";
import { RenderTrackDuration } from "./duration";

export default function QueueItem({ item }: { item: Track }) {
  const { colors } = useAppTheme();
  const { play, removeFromQueue } = useAudio();

  const handleQueueItemPress = (item: Track) => {
    play(item);
  };

  const handleLongPress = (item: Track) => {
    removeFromQueue(item.id);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleQueueItemPress(item);
      }}
      onLongPress={() => {
        handleLongPress(item);
      }}
    >
      <View className="flex-row justify-between items-center p-2 gap-2 ">
        <Image
          source={item.artwork}
          contentFit="contain"
          style={{
            aspectRatio: 1,
            height: 68,
            width: 68,
            borderRadius: 8,
          }}
        />
        <View className="flex-1 gap-1">
          <Text className="text-xs" style={{ color: colors.secondaryText }}>
            {formatDate(item.date)}
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.text }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text
            className="text-xs"
            style={{
              color: colors.secondaryText,
            }}
          >
            {RenderTrackDuration(item)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
