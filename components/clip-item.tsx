import { Clip } from "@/types/types";
import { formatDate } from "@/utils/formatters";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useRouter } from "expo-router";
import PlayButton from "./play-button";
import { Track } from "@/state/audio";
import QueueButton from "./queue-button";
import { RenderClipDuration } from "./duration";

export default function ClipItem({ item }: { item: Clip }) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const clipToTrack: Track = {
    id: item.Id,
    title: item.Title,
    url: item.AudioUrl,
    duration: item.DurationSeconds,
    date: item.PublishedUtc,
    artwork: item.ImageUrl,
    description: item.Description,
    descriptionHTML: item.DescriptionHtml,
  };

  return (
    <View className="flex-row justify-between items-center">
      <TouchableOpacity
        className="flex-1 pr-4"
        onPress={() => {
          router.navigate(`/(episode)/${item.Id}`);
        }}
      >
        <View className="flex-1">
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
            <RenderClipDuration item={item} />
          </Text>
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <QueueButton size={32} item={clipToTrack} />
        <PlayButton size={44} color={colors.secondary} track={clipToTrack} />
      </View>
    </View>
  );
}
