import { useAppTheme } from "./ui/theme-provider";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { use$ } from "@legendapp/state/react";
import { RenderTrackDuration } from "./duration";
import PlayButton from "./play-button";
import { useActiveTrack, useProgress } from "react-native-track-player";
import { formatDate } from "../utils/formatters";

export default function QueueHeaderItem() {
  const { colors } = useAppTheme();

  // The header's single source of truth is the currently active track.
  const track = useActiveTrack();
  // The component will now automatically re-render when the track or progress changes.
  const progress = useProgress();

  // If there's no track, the queue is empty, so render nothing.
  if (!track) {
    return null;
  }

  // 3. Calculate Progress Reactively
  // Use the duration from the progress object for the most accuracy,
  // but fall back to the track's metadata duration if needed.
  const duration = progress.duration || track.duration || 0;
  const position = progress.position || 0;
  const progressWidth = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View
      className="flex-row justify-between items-center p-2 gap-2 border rounded-2xl overflow-hidden"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.border,
      }}
    >
      {/* The progress bar now works correctly */}
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
          {/* Use track.isLiveStream for a more direct check */}
          {track.isLiveStream ? (
            <Text className="font-semibold" style={{ color: colors.error }}>
              ON AIR
            </Text>
          ) : (
            <RenderTrackDuration track={track} />
          )}
        </Text>
      </View>
      <View className="flex-2 ml-1">
        <PlayButton
          size={44}
          color={colors.secondary}
          track={track}
          isLiveStream={track.isLiveStream}
        />
      </View>
    </View>
  );
}
