import { useAudio } from "@/context/audio-context";
import { useAppTheme } from "./ui/theme-provider";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { formatDate, formatDuration } from "@/utils/formatters";

export default function QueueHeaderItem() {
  const { colors } = useAppTheme();
  const { currentTrack, player } = useAudio();

  const handleProgressWidth =
    currentTrack?.duration > 0
      ? (player.currentTime / currentTrack?.duration) * 100
      : 0;

  return (
    <View
      className="flex-row justify-between items-center p-2 gap-2 border rounded-2xl overflow-hidden"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <View
        className="absolute h-[150%] left-0 rounded-2xl"
        style={[
          {
            backgroundColor: colors.border,
            width: `${handleProgressWidth}%`,
          },
        ]}
      />
      <View>
        <Image
          source={currentTrack?.artwork}
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
          {formatDate(currentTrack?.date)}
        </Text>
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.text }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {currentTrack?.title}
        </Text>
        <Text
          className="text-xs"
          style={{
            color: colors.secondaryText,
          }}
        >
          {formatDuration(currentTrack?.duration, "summary")}
        </Text>
      </View>
    </View>
  );
}
