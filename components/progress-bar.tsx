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
  // --- 1. Call ALL hooks at the top level, unconditionally ---
  const { colors } = useAppTheme();
  const { seekTo, saveCurrentTrackProgress } = useAudio();

  const barWidth = useSharedValue(0);
  const isScrubbing = useSharedValue(false);
  const scrubbingTime = useSharedValue(0);

  const progress = use$(audio$.progress);
  const track = use$(audio$.currentTrack);

  // --- 2. Define local variables safely ---
  // These will correctly be 0 if there's no track or duration.
  const duration = progress.duration || track?.duration || 0;
  const actualCurrentTime = progress.position || 0;

  // --- 3. Call the rest of the hooks, which are now safe ---
  const displayCurrentTime = useDerivedValue(() => {
    return isScrubbing.value ? scrubbingTime.value : actualCurrentTime;
  });

  const formattedCurrentTime = useDerivedValue(() => {
    return formatDurationForProgressBar(displayCurrentTime.value);
  });

  const formattedRemainingTime = useDerivedValue(() => {
    const remaining = duration - displayCurrentTime.value;
    return `-${formatDurationForProgressBar(remaining < 0 ? 0 : remaining)}`;
  });

  const animatedProgressStyle = useAnimatedStyle(() => {
    // This logic is safe because if duration is 0, progress will be 0.
    const progress =
      duration > 0 ? (displayCurrentTime.value / duration) * 100 : 0;
    return {
      width: `${progress}%`,
    };
  });

  // --- 4. Define non-hook logic ---
  const initialFormattedCurrentTime =
    formatDurationForProgressBar(actualCurrentTime);
  const initialFormattedRemainingTime = `-${formatDurationForProgressBar(
    Math.max(0, duration - actualCurrentTime),
  )}`;

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isScrubbing.value = true;
    })
    .onUpdate((event) => {
      const newPosition = (event.x / barWidth.value) * duration;
      scrubbingTime.value = Math.max(0, Math.min(newPosition, duration));
    })
    .onEnd(() => {
      runOnJS(seekTo)(scrubbingTime.value);
      runOnJS(saveCurrentTrackProgress)();
    })
    .onFinalize(() => {
      isScrubbing.value = false;
    });

  // --- 5. NOW, we can have our conditional return ---
  // This happens after all hooks have been called for this render.
  if (!track || track.isLiveStream) {
    return null;
  }

  // --- 6. The final return statement for the successful case ---
  return (
    <View className="mt-8 gap-2">
      <GestureDetector gesture={panGesture}>
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
