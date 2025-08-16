import { useLayout } from "@/context/layout-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useAppTheme } from "./ui/theme-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMetadata } from "@/hooks/useMetadata";
import { PlayerUI } from "./ui/player-ui";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

const { height: screenHeight, width } = Dimensions.get("window");
const MINI_PLAYER_HEIGHT = 64;

export const Player = () => {
  const { colors } = useAppTheme();
  const { tabBarHeight } = useLayout();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const area = useSafeAreaInsets();

  const { id, playbackState, queueLength } = use$(() => {
    const currentTrack = audio$.currentTrack.get();
    return {
      id: currentTrack?.id,
      playbackState: audio$.playbackState.get(),
      queueLength: audio$.queue.total.get(),
    };
  });

  const { data } = useMetadata(id, 1);

  const animatedIndex = useSharedValue(0);

  // When using a wrapper, the snap points are relative to the wrapper.
  const snapPoints = useMemo(() => [MINI_PLAYER_HEIGHT, "100%"], []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  // Animated style for the album art
  const animatedImageStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedIndex.value,
      [0, 1],
      [50, width - 24], // from 50x50 to full width minus padding
    );
    const borderRadius = interpolate(
      animatedIndex.value,
      [0, 1],
      [8, 16], // from rounded corners to larger rounded corners
    );

    return {
      width: size,
      height: size,
      borderRadius,
    };
  });

  // Animated style for the full player container
  const animatedFullPlayerStyle = useAnimatedStyle(() => {
    // By changing the input range of the interpolation, we can control *when* the fade happens.
    // Here, the full player fades in during the first 50% of the gesture,
    // making the transition feel faster and more responsive.
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.5], // Input range
      [0, 1], // Output range
      "clamp", // Extrapolation
    );
    return {
      opacity,
      pointerEvents: opacity > 0.5 ? "auto" : "none",
    };
  });

  // Animated style for the mini player container
  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    // The mini player fades out very quickly (in the first 10% of the gesture)
    // to avoid a long, slow cross-fade where both players are visible.
    const opacity = interpolate(animatedIndex.value, [0, 0.1], [1, 0], "clamp");
    return {
      opacity,
      pointerEvents: opacity > 0.5 ? "auto" : "none",
    };
  });

  const handleSecondaryText = useCallback(() => {
    if (id === "XNRD" && data) {
      return (
        <Text className="text-sm" style={{ color: colors.secondaryText }}>
          {data?.track_artist_name}
        </Text>
      );
    }
    return null;
  }, [id, data, colors.secondaryText]);

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

  useEffect(() => {
    if (tabBarHeight > 0) {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [tabBarHeight]);

  // The player should show if the state is NOT idle, OR if there are items in the queue.
  const isPlayerVisible = playbackState !== "idle" || queueLength > 0;

  if (tabBarHeight === 0 || !isPlayerVisible) {
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
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        animatedIndex={animatedIndex}
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
            animatedImageStyle={animatedImageStyle}
            animatedFullPlayerStyle={animatedFullPlayerStyle}
            animatedMiniPlayerStyle={animatedMiniPlayerStyle}
            onExpand={expand}
            onCollapse={collapse}
            handleSecondaryText={handleSecondaryText}
          />
        </BottomSheetView>
      </BottomSheet>
    </Animated.View>
  );
};
