import { useAppTheme } from "./ui/theme-provider";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { formatDate } from "@/utils/formatters";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { RenderTrackDuration } from "./duration";
import PlayButton from "./play-button";

export default function QueueHeaderItem() {
  const { colors } = useAppTheme();

  const data = use$(() => {
    const track = audio$.currentTrack.get();

    if (!track) {
      return null;
    }

    const status = audio$.status.get();

    const currentTimeInSeconds =
      status?.isLoaded && status.currentTime ? status.currentTime : 0;
    const durationInSeconds = track.duration ? track.duration : 0;

    return {
      track,
      currentTime: currentTimeInSeconds,
      duration: durationInSeconds,
    };
  });

  //If selector returns null (because the queue is empty),
  // render nothing.
  if (!data) {
    return null;
  }

  const { track, currentTime, duration } = data;

  const progressWidth = duration > 0 ? (currentTime / duration) * 100 : 0;

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
            width: `${progressWidth}%`,
          },
        ]}
      />
      <View>
        <Image
          source={track.artwork}
          contentFit="contain"
          style={{
            aspectRatio: 1,
            height: 68,
            width: 68,
            borderRadius: 8,
          }}
        />
      </View>
      <View className="flex-1">
        {!track.date ? null : (
          <Text className="text-xs" style={{ color: colors.secondaryText }}>
            {formatDate(track.date)}
          </Text>
        )}
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.text }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {track.title}
        </Text>
        <Text className="text-xs" style={{ color: colors.secondaryText }}>
          {!track.duration ? (
            <Text className="font-semibold" style={{ color: colors.error }}>
              ON AIR
            </Text>
          ) : (
            <RenderTrackDuration track={track} />
          )}
        </Text>
      </View>
      <View className="flex-2 ml-1">
        <PlayButton size={44} color={colors.secondary} track={track} />
      </View>
    </View>
  );
}
