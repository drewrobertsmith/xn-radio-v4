import { Clip } from "@/types/types";
import { formatDate, formatDuration } from "@/utils/formatters";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useRouter } from "expo-router";
import PlayButton from "./play-button";
import { useObserve, useSelector, use$ } from "@legendapp/state/react";
import { audio$, Track } from "@/state/audio";
import QueueButton from "./queue-button";
import { useAudio } from "@/context/audio-context";

export default function ClipItem({ item }: { item: Clip }) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const effectiveProgressSec = use$(() => {
    const currentTrackId = audio$.currentTrack.id.get();
    const playbackState = audio$.playbackState.get();

    // Check if THIS ClipItem is the one that's currently loaded in the player.
    const isPlayingThisItem = currentTrackId === item.Id;

    // If this item is the one playing or paused, use the LIVE player time.
    // This will cause this specific ClipItem to re-render as the time updates.
    if (
      isPlayingThisItem &&
      (playbackState === "playing" || playbackState === "paused")
    ) {
      return audio$.status.currentTime.get();
    }

    // Otherwise, for all other items, just use the last saved progress.
    // This will not cause re-renders unless the saved progress changes.
    return audio$.progress[item.Id].get();
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

  const renderDuration = () => {
    const progressSeconds = effectiveProgressSec || 0;
    if (progressSeconds > 1) {
      // Check for > 1 to avoid showing "1s left" for negligible progress
      const remaining = item.DurationSeconds - progressSeconds;
      // Ensure we don't show a negative duration if there's a slight delay
      if (remaining < 0) return null;
      return <Text>{formatDuration(remaining, "summary")} left</Text>;
    }
    return <Text>{formatDuration(item.DurationSeconds, "summary")}</Text>;
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
            {renderDuration()}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <QueueButton size={32} color={colors.secondary} item={clipToTrack} />
        <PlayButton size={44} color={colors.secondary} track={clipToTrack} />
      </View>
    </View>
  );
}
