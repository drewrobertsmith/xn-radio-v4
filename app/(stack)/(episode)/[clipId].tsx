import { useAppTheme } from "@/components/ui/theme-provider";
import { useIndividualClip } from "@/hooks/useIndividualClip";
import { Clip } from "@/types/types";
import { formatDate, formatDuration } from "@/utils/formatters";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useLayout } from "@/context/layout-context";
import PlayButton from "@/components/play-button";
import { Track, useAudio } from "@/context/audio-context";
import QueueButton from "@/components/queue-button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ClipPage() {
  const { colors } = useAppTheme();
  const { clipId } = useLocalSearchParams<{ clipId: Clip["Id"] }>();
  const { data: item } = useIndividualClip(clipId);
  const { tabBarHeight } = useLayout();
  const { currentTrack, status } = useAudio();

  const clipToTrack: Track = {
    id: item?.Id,
    title: item?.Title,
    url: item?.AudioUrl,
    duration: item?.DurationSeconds,
    date: item?.PublishedUtc,
    artwork: item?.ImageUrl,
    description: item?.Description,
  };

  const handleDuration = () => {
    if (currentTrack?.id === item?.Id) {
      return (
        <Text
          className="text-sm font-[500]"
          style={{ color: colors.secondaryText }}
        >
          {formatDuration(
            item?.DurationSeconds - status?.currentTime,
            "summary",
          )}{" "}
          left
        </Text>
      );
    } else {
      return (
        <Text
          className="text-sm font-[500]"
          style={{ color: colors.secondaryText }}
        >
          {formatDuration(item?.DurationSeconds, "summary")}
        </Text>
      );
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 8,
        marginVertical: 8,
        paddingBottom: tabBarHeight,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-[50%]">
        <Image
          source={item?.ImageUrl}
          contentFit="contain"
          cachePolicy="memory-disk"
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
      </View>
      <Text className="text-2xl font-bold" style={{ color: colors.text }}>
        {item?.Title}
      </Text>
      <View className="flex-row items-center flex-1 gap-4">
        <MaterialIcons
          name="check-circle-outline"
          size={40}
          color={colors.secondary}
        />
        <PlayButton track={clipToTrack} size={72} color={colors.secondary} />
        <QueueButton item={clipToTrack} size={40} color={colors.secondary} />
      </View>
      <View className="w-[100%] flex-row justify-between">
        <Text
          className="text-sm font-[500]"
          style={{ color: colors.secondaryText }}
        >
          {formatDate(item?.PublishedUtc)}
        </Text>
        {handleDuration()}
      </View>
      <Text className="text-base" style={{ color: colors.text }}>
        {item?.Description}
      </Text>
    </ScrollView>
  );
}
