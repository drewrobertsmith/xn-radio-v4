import { useAudio } from "@/context/audio-context";
import { useAppTheme } from "./ui/theme-provider";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { formatDate, formatDuration } from "@/utils/formatters";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

export default function QueueHeaderItem() {
  const { colors } = useAppTheme();
  const { player } = useAudio();
  const { queue } = useSelector(() => {
    return {
      queue: audio$.queue.tracks.get(),
    };
  });

  const topInQueue = queue[0];

  const handleProgressWidth =
    topInQueue.duration > 0
      ? (player.currentTime / topInQueue.duration) * 100
      : 0;

  const handleDuration = () => {
    return (
      <Text
        className="text-xs"
        style={{
          color: colors.secondaryText,
        }}
      >
        {formatDuration(topInQueue.duration - player.currentTime, "summary")}{" "}
        left
      </Text>
    );
  };

  return (
    <View
      className="flex-row justify-between items-center p-2 gap-2 border rounded-2xl overflow-hidden"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.border,
      }}
    >
      <View
        className="absolute h-[150%] left-0  rounded-2xl"
        style={[
          {
            backgroundColor: colors.card,
            width: `${handleProgressWidth}%`,
          },
        ]}
      />
      <View>
        <Image
          source={topInQueue.artwork}
          contentFit="contain"
          style={{
            aspectRatio: 1,
            height: 68,
            width: 68,
            borderRadius: 8,
          }}
        />
      </View>
      <View className="w-[85%] gap-1">
        <Text className="text-xs" style={{ color: colors.secondaryText }}>
          {formatDate(topInQueue.date)}
        </Text>
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.text }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {topInQueue.title}
        </Text>
        {handleDuration()}
      </View>
    </View>
  );
}
