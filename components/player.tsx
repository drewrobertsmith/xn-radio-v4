import { useLayout } from "@/context/layout-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAppTheme } from "./ui/theme-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlayerUI } from "./ui/player-ui";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { usePlayerAnimation } from "@/context/player-animation-context";

const MINI_PLAYER_HEIGHT = 64;

export const Player = () => {
  const { colors } = useAppTheme();
  const { tabBarHeight } = useLayout();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const area = useSafeAreaInsets();
  const { screenHeight, animatedIndex } = usePlayerAnimation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { playbackState, queueLength } = use$(() => {
    return {
      playbackState: audio$.playbackState.get(),
      queueLength: audio$.queue.total.get(),
    };
  });

  // When using a wrapper, the snap points are relative to the wrapper.
  const snapPoints = useMemo(() => [MINI_PLAYER_HEIGHT, "100%"], []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  // Sync UI thread animation with JS thread state ---
  // This reaction runs on the UI thread and updates the JS thread state
  // only when the player crosses a threshold. This is more efficient
  // than checking on every frame.
  useAnimatedReaction(
    () => animatedIndex.value > 0.5,
    (isPlayerExpanded, wasPlayerExpanded) => {
      runOnJS(setIsExpanded)(isPlayerExpanded);
    },
    [animatedIndex],
  );

  // Animated style for the full player container
  const animatedFullPlayerStyle = useAnimatedStyle(() => {
    // By changing the input range of the interpolation, we can control *when* the fade happens.
    // Here, the full player fades in during the first 50% of the gesture,
    // making the transition feel faster and more responsive.
    const opacity = interpolate(
      animatedIndex.value,
      [0.2, 0.7], // Input range
      [0, 1], // Output range
      "clamp", // Extrapolation
    );
    return {
      opacity,
      // Set display to 'none' when fully collapsed to remove it from the layout tree
      display: animatedIndex.value < 0.01 ? "none" : "flex",
    };
  });

  // Animated style for the mini player container
  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    // The mini player fades out very quickly (in the first 10% of the gesture)
    // to avoid a long, slow cross-fade where both players are visible.
    const opacity = interpolate(animatedIndex.value, [0, 0.3], [1, 0], "clamp");
    return {
      opacity,
      display: animatedIndex.value > 0.99 ? "none" : "flex",
    };
  });

  const animatedPadding = useAnimatedStyle(() => {
    const bottomPadding = interpolate(
      animatedIndex.value,
      [0, 1],
      [tabBarHeight + 8, 0],
    );
    const sidePadding = interpolate(animatedIndex.value, [0, 1], [8, 0]);

    return {
      bottom: bottomPadding,
      left: sidePadding,
      right: sidePadding,
    };
  });

  // The player should show if the state is NOT idle, OR if there are items in the queue.
  const isPlayerVisible = playbackState !== "idle" || queueLength > 0;

  // useEffect(() => {
  //   if (isPlayerVisible && tabBarHeight > 0) {
  //     bottomSheetRef.current?.snapToIndex(0);
  //   }
  // }, [tabBarHeight, isPlayerVisible]);

  if (!isPlayerVisible) {
    return null;
  }

  return (
    // 1. The Wrapper View creates a container that is ONLY the size of the mini-player.
    <Animated.View
      style={[
        {
          position: "absolute",
          padding: 8,
          height: screenHeight,
        },
        animatedPadding,
      ]}
      // This allows touches to pass through the empty space of this wrapper
      // to the tab bar underneath.
      pointerEvents="box-none"
    >
      {tabBarHeight > 0 && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          animatedIndex={animatedIndex}
          activeOffsetX={[-20, 20]}
          activeOffsetY={[-5, 5]}
          enableDynamicSizing={false}
          enablePanDownToClose={false}
          enableOverDrag={false}
          topInset={area.top}
          handleComponent={null}
          containerStyle={{
            borderRadius: 8,
          }}
          backgroundStyle={{
            backgroundColor: colors.card,
          }}
          style={{ padding: 8 }}
        >
          <BottomSheetView
            style={{
              flex: 1,
              bottom: area.bottom,
            }}
            pointerEvents="auto"
          >
            <PlayerUI
              isExpanded={isExpanded}
              animatedFullPlayerStyle={animatedFullPlayerStyle}
              animatedMiniPlayerStyle={animatedMiniPlayerStyle}
              onExpand={expand}
              onCollapse={collapse}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </Animated.View>
  );
};
