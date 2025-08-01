import { Platform, Text, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useSynchronizedDurations } from "@/hooks/useSynchronizedDurations";
import { useAudio } from "@/context/audio-context";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

export default function ProgressBar() {
  const { colors } = useAppTheme();
  const { player } = useAudio();
  const duration = useSelector(() => audio$.currentTrack.duration.get());
  const {
    formattedCurrentTime: currentTime,
    formattedRemainingTime: remainingDuration,
  } = useSynchronizedDurations(player.currentTime, duration);

  const progressWidth =
    duration > 0 ? (player.currentTime / duration) * 100 : 0;

  return (
    <View className="mt-8 gap-2">
      <View
        style={[
          {
            backgroundColor: colors.border,
          },
        ]}
        className="h-2 rounded items-stretch"
      >
        <View
          className="h-full rounded"
          style={{
            backgroundColor: colors.secondary,
            width: `${progressWidth}%`,
          }}
        />
      </View>
      <View className="w-[100%] justify-between flex-row">
        <Text
          className="w-[70] text-left"
          style={{
            color: colors.secondaryText,
            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
          }}
        >
          {currentTime}
        </Text>
        <Text
          className="w-[70] text-right"
          style={{
            color: colors.secondaryText,
            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
          }}
        >
          -{remainingDuration}
        </Text>
      </View>
    </View>
  );
}
