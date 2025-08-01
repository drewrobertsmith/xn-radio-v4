import { Clip } from "@/types/types";
import { formatDate, formatDuration } from "@/utils/formatters";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useRouter } from "expo-router";
import PlayButton from "./play-button";
import { useSelector } from "@legendapp/state/react";
import { audio$, Track } from "@/state/audio";
import QueueButton from "./queue-button";

export default function ClipItem({ item }: { item: Clip }) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { id, currentTime } = useSelector(() => {
    return {
      id: audio$.currentTrack.id.get(),
      currentTime: audio$.status.currentTime.get(),
    };
  });

  const clipToTrack: Track = {
    id: item.Id,
    title: item.Title,
    url: item.AudioUrl,
    duration: item.DurationSeconds,
    date: item.PublishedUtc,
    artwork: item.ImageUrl,
    description: item.Description,
  };

  const handleDuration = () => {
    if (id === item.Id) {
      return (
        <Text
          className="text-sm font-[500]"
          style={{ color: colors.secondaryText }}
        >
          {formatDuration(item.DurationSeconds - currentTime, "summary")} left
        </Text>
      );
    } else {
      return (
        <Text
          className="text-sm font-[500]"
          style={{ color: colors.secondaryText }}
        >
          {formatDuration(item.DurationSeconds, "summary")}
        </Text>
      );
    }
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
          {handleDuration()}
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <QueueButton size={32} color={colors.secondary} item={clipToTrack} />
        <PlayButton size={44} color={colors.secondary} track={clipToTrack} />
      </View>
    </View>
  );
}
