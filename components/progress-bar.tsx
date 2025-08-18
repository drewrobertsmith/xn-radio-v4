import { Platform, Text, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useSynchronizedDurations } from "@/hooks/useSynchronizedDurations";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

export default function ProgressBar() {
  const { colors } = useAppTheme();

  const { duration, currentTime } = use$(() => {
    const track = audio$.currentTrack.get();
    const status = audio$.status.get();

    const currentTimeInSeconds =
      status?.isLoaded && status.currentTime ? status.currentTime : 0;
    const durationInSeconds = track?.duration ? track.duration : 0;

    return {
      currentTime: currentTimeInSeconds,
      duration: durationInSeconds,
    };
  });

  const { formattedCurrentTime, formattedRemainingTime } =
    useSynchronizedDurations(currentTime, duration);

  const progressWidth = duration > 0 ? (currentTime / duration) * 100 : 0;

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
          {formattedCurrentTime}
        </Text>
        <Text
          className="w-[70] text-right"
          style={{
            color: colors.secondaryText,
            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
          }}
        >
          -{formattedRemainingTime}
        </Text>
      </View>
    </View>
  );
}
