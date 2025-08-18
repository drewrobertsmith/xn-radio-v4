import { Platform, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useAudio } from "@/context/audio-context";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { formatDurationForProgressBar } from "@/utils/formatDurationForProgressBar";
import { AnimatedText } from "./ui/animatedText";

export default function ProgressBar() {
  const { colors } = useAppTheme();
  const { seekTo, saveCurrentTrackProgress } = useAudio();

  // Store barWidth on the UI thread to prevent re-renders
  const barWidth = useSharedValue(0);
  const isScrubbing = useSharedValue(false);
  const scrubbingTime = useSharedValue(0);

  // This part remains the same, it's already efficient
  const { duration, currentTime: actualCurrentTime } = use$(() => {
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

  // Derived value for the time to display (UI thread).
  // This is the single source of truth for the current time in the UI.
  const displayCurrentTime = useDerivedValue(() => {
    return isScrubbing.value ? scrubbingTime.value : actualCurrentTime;
  });

  // Derived values for formatted text strings (UI thread).
  const formattedCurrentTime = useDerivedValue(() => {
    return formatDurationForProgressBar(displayCurrentTime.value);
  });

  const formattedRemainingTime = useDerivedValue(() => {
    const remaining = duration - displayCurrentTime.value;
    return `-${formatDurationForProgressBar(remaining < 0 ? 0 : remaining)}`;
  });

  // Animated style for the progress bar width (UI thread).
  const animatedProgressStyle = useAnimatedStyle(() => {
    const progress =
      duration > 0 ? (displayCurrentTime.value / duration) * 100 : 0;
    return {
      width: `${progress}%`,
    };
  });

  // --- JS Thread Logic (for initial render) ---
  // Calculate the initial strings using the values from use$
  const initialFormattedCurrentTime =
    formatDurationForProgressBar(actualCurrentTime);
  const initialFormattedRemainingTime = `-${formatDurationForProgressBar(
    Math.max(0, duration - actualCurrentTime),
  )}`;

  // OPTIMIZED Gesture handler (UI thread)
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isScrubbing.value = true;
    })
    .onUpdate((event) => {
      // Update the UI instantly without hammering the audio engine
      const newPosition = (event.x / barWidth.value) * duration;
      scrubbingTime.value = Math.max(0, Math.min(newPosition, duration));
    })
    .onEnd(() => {
      // Only seek and save on the JS thread when the user releases their finger
      runOnJS(seekTo)(scrubbingTime.value);
      runOnJS(saveCurrentTrackProgress)();
    })
    .onFinalize(() => {
      isScrubbing.value = false;
    });

  return (
    <View className="mt-8 gap-2">
      <GestureDetector gesture={panGesture}>
        <View
          onLayout={(event) => {
            // Set the shared value without causing a re-render
            barWidth.value = event.nativeEvent.layout.width;
          }}
          hitSlop={{ top: 20, bottom: 20, right: 0, left: 0 }}
          style={[{ backgroundColor: colors.border }]}
          className="h-4 rounded items-stretch"
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
          initalValue={initialFormattedCurrentTime}
          style={{ width: 70, textAlign: "left" }}
        />
        <AnimatedText
          animatedValue={formattedRemainingTime}
          initalValue={initialFormattedRemainingTime}
          style={{ width: 70, textAlign: "right" }}
        />
      </View>
    </View>
  );
}
