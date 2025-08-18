import { Platform, Text, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useSynchronizedDurations } from "@/hooks/useSynchronizedDurations";
import { useAudio } from "@/context/audio-context";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useState } from "react";

export default function ProgressBar() {
  const { colors } = useAppTheme();
  const { seekTo, saveCurrentTrackProgress } = useAudio();
  const [barWidth, setBarWidth] = useState(0);

  const isScrubbing = useSharedValue(false);
  const scrubbingTime = useSharedValue(0);

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

  // Derived value for the time to display (runs on UI thread).
  // This value updates whenever isScrubbing, scrubbingTime, or actualCurrentTime changes.
  const displayCurrentTime = useDerivedValue(() => {
    return isScrubbing.value ? scrubbingTime.value : actualCurrentTime;
  });

  // State variable on the JavaScript thread to hold the current time.
  // This is the value that useSynchronizedDurations will consume.
  const [jsCurrentTime, setJsCurrentTime] = useState(0);

  // useAnimatedReaction observes displayCurrentTime (on UI thread)
  // and updates jsCurrentTime (on JS thread) using runOnJS.
  useAnimatedReaction(
    () => {
      // This function runs on the UI thread (worklet)
      return displayCurrentTime.value; // Observe the derived value
    },
    (currentValue) => {
      // This function also runs on the UI thread (worklet)
      // We use runOnJS to execute setJsCurrentTime on the JavaScript thread.
      runOnJS(setJsCurrentTime)(currentValue);
    },
    [], // Dependencies for useAnimatedReaction. Empty array means it runs once.
    // displayCurrentTime is already reactive, so no need to list it here.
  );

  // Call useSynchronizedDurations with the JS-thread current time.
  // This hook is now called correctly within the component's render function.
  const { formattedCurrentTime, formattedRemainingTime } =
    useSynchronizedDurations(jsCurrentTime, duration);

  // Animated style for the progress bar width (runs on UI thread).
  // This directly uses the displayCurrentTime.value from the UI thread.
  const animatedProgressStyle = useAnimatedStyle(() => {
    const progress =
      duration > 0 ? (displayCurrentTime.value / duration) * 100 : 0;
    return {
      width: `${progress}%`,
    };
  });

  // Create the gesture handler (runs on UI thread)
  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      isScrubbing.value = true;
      const newPosition = (event.x / barWidth) * duration;
      const clampedPosition = Math.max(0, Math.min(newPosition, duration));
      scrubbingTime.value = clampedPosition;
      runOnJS(seekTo)(clampedPosition);
    })
    .onUpdate((event) => {
      const newPosition = (event.x / barWidth) * duration;
      const clampedPosition = Math.max(0, Math.min(newPosition, duration));
      scrubbingTime.value = clampedPosition;
      runOnJS(seekTo)(clampedPosition);
    })
    .onEnd(() => {
      isScrubbing.value = false;
      runOnJS(saveCurrentTrackProgress)();
    });

  return (
    <View className="mt-8 gap-2">
      <GestureDetector gesture={panGesture}>
        <View
          onLayout={(event) => {
            setBarWidth(event.nativeEvent.layout.width);
          }}
          hitSlop={{ top: 20, bottom: 20, right: 0, left: 0 }}
          style={[
            {
              backgroundColor: colors.border,
            },
          ]}
          className="h-4 rounded items-stretch"
        >
          <Animated.View
            className="h-full rounded"
            style={[
              {
                backgroundColor: colors.secondary,
              },
              animatedProgressStyle,
            ]}
          />
        </View>
      </GestureDetector>
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
