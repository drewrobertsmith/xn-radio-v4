import { Text, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { formatDate, formatDuration } from "@/utils/formatters";
import { Image } from "expo-image";
import { Track } from "@/state/audio";

export default function QueueItem({ item }: { item: Track }) {
  const { colors } = useAppTheme();

  return (
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
      <View className="w-[85%] gap-1">
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
          {formatDuration(item.duration, "summary")}
        </Text>
      </View>
    </View>
  );
}
