import { View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { use$ } from "@legendapp/state/react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedText } from "./ui/animatedText";
import { useEffect } from "react";
import { useActiveTrack, useProgress } from "react-native-track-player";
import { formatDurationForProgressBar } from "../utils/formatDurationForProgressBar";
import { scheduleOnRN } from "react-native-worklets";

export default function ProgressBar() {
  // --- 1. Call ALL hooks at the top level, unconditionally ---
  const { colors } = useAppTheme();

  const progress = useProgress();
  const track = useActiveTrack();

  // --- 2. Define local variables safely ---
  // These will correctly be 0 if there's no track or duration.
  const duration = progress.duration || track?.duration || 0;
  const actualCurrentTime = progress.position || 0;

  const barWidth = useSharedValue(0);
  const isScrubbing = useSharedValue(false);
  const progressPosition = useSharedValue(0);

  useEffect(() => {
    if (!isScrubbing.value) {
      // Use withTiming for a smooth transition in case of small jumps
      progressPosition.value = withTiming(actualCurrentTime, { duration: 100 });
    }
  }, [actualCurrentTime, progressPosition, isScrubbing]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    // This logic is safe because if duration is 0, progress will be 0.
    const progress =
      duration > 0 ? (progressPosition.value / duration) * 100 : 0;
    return {
      width: `${progress}%`,
    };
  });

  const formattedCurrentTime = useDerivedValue(() => {
    return formatDurationForProgressBar(progressPosition.value);
  });

  const formattedRemainingTime = useDerivedValue(() => {
    const remaining = duration - progressPosition.value;
    return `-${formatDurationForProgressBar(remaining < 0 ? 0 : remaining)}`;
  });

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd((event) => {
      if (barWidth.value > 0) {
        const newPosition = (event.x / barWidth.value) * duration;
        const clampedPosition = Math.max(0, Math.min(newPosition, duration));
        // Run the JS-thread actions after the tap is complete
        // scheduleOnRN(seekTo, clampedPosition);
        // scheduleOnRN(saveCurrentTrackProgress);
      }
    });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isScrubbing.value = true;
    })
    .onUpdate((event) => {
      const newPosition = (event.x / barWidth.value) * duration;
      progressPosition.value = Math.max(0, Math.min(newPosition, duration));
    })
    .onEnd(() => {
      // runOnJS(seekTo)(progressPosition.value);
      // runOnJS(saveCurrentTrackProgress)();
    })
    .onFinalize(() => {
      isScrubbing.value = false;
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);
  // --- 5. NOW, we can have our conditional return ---
  // This happens after all hooks have been called for this render.
  if (!track || track.isLiveStream) {
    return null;
  }

  // --- 6. The final return statement for the successful case ---
  return (
    <View className="mt-8 gap-2">
      <GestureDetector gesture={composedGesture}>
        <View
          onLayout={(event) => {
            barWidth.value = event.nativeEvent.layout.width;
          }}
          hitSlop={{ top: 20, bottom: 20, right: 0, left: 0 }}
          style={[{ backgroundColor: colors.border }]}
          className="h-2 rounded items-stretch"
        >
          <Animated.View
            className="h-full rounded"
            style={[
              { backgroundColor: colors.secondary },
              animatedProgressStyle,
            ]}
          />
        </View>
      </GestureDetector>
      <View className="w-[100%] justify-between flex-row">
        <AnimatedText
          animatedValue={formattedCurrentTime}
          initalValue={formatDurationForProgressBar(actualCurrentTime)}
          style={{ width: 70, textAlign: "left" }}
        />
        <AnimatedText
          animatedValue={formattedRemainingTime}
          initalValue={`-${formatDurationForProgressBar(
            Math.max(0, duration - actualCurrentTime),
          )}`}
          style={{ width: 70, textAlign: "right" }}
        />
      </View>
    </View>
  );
}
