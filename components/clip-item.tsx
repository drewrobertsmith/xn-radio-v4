import { Clip } from "@/types/types";
import { formatDate, formatDuration } from "@/utils/formatters";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme } from "./ui/theme-provider";
import { useRouter } from "expo-router";
import PlayButton from "./play-button";

export default function ClipItem({ item }: { item: Clip }) {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View className="flex-row flex-1 justify-between items-center">
      <TouchableOpacity
        className="w-[85%]"
        onPress={() => {
          router.navigate(`/(episode)/${item.Id}`);
        }}
      >
        <View className="w-[85%]">
          <Text
            className="text-sm font-[500]"
            style={{ color: colors.secondaryText }}
          >
            {formatDate(item.PublishedUtc)}
          </Text>
          <Text
            className="text-base font-semibold"
            style={{ color: colors.text }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.Title}
          </Text>
          <Text
            className="text-sm font-[500]"
            style={{ color: colors.secondaryText }}
          >
            {formatDuration(item.DurationSeconds)}
          </Text>
        </View>
      </TouchableOpacity>

      <View>
        <PlayButton size={44} color={colors.secondary} track={item} />
      </View>
    </View>
  );
}
