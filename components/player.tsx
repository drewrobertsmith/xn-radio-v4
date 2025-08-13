import { useLayout } from "@/context/layout-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "./ui/theme-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudio } from "@/context/audio-context";
import { useMetadata } from "@/hooks/useMetadata";
import { PlayerUI } from "./ui/player-ui";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

const { height: screenHeight, width } = Dimensions.get("window");
const MINI_PLAYER_HEIGHT = 64;

export const Player = () => {
  const { colors } = useAppTheme();
  const { tabBarHeight } = useLayout();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const area = useSafeAreaInsets();
  const { player } = useAudio();

  // const currentTrack = useSelector(audio$.currentTrack);
  // const playbackState = useSelector(audio$.playbackState);
  // const status = useSelector(audio$.status);
  //
  const { id, playbackState } = useSelector(() => {
    return {
      id: audio$.currentTrack.id.get(),
      playbackState: audio$.playbackState.get(),
    };
  });

  const { data } = useMetadata(id, 1);

  const animatedIndex = useSharedValue(0);
  const largePlayerOpacity = useSharedValue(0);
  const smallPlayerOpacity = useSharedValue(1);

  // When using a wrapper, the snap points are relative to the wrapper.
  const snapPoints = useMemo(() => [MINI_PLAYER_HEIGHT, "100%"], []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const onAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      const isExpanding = fromIndex === 0 && toIndex === 1;
      const isCollapsing = fromIndex === 1 && toIndex === 0;

      if (isExpanding) {
        // Fade in the large player, fade out the small one
        largePlayerOpacity.value = withTiming(1, { duration: 300 });
        smallPlayerOpacity.value = withTiming(0, { duration: 100 });
      }

      if (isCollapsing) {
        // Do the reverse
        largePlayerOpacity.value = withTiming(0, { duration: 100 });
        smallPlayerOpacity.value = withTiming(1, { duration: 300 });
      }
    },
    [largePlayerOpacity, smallPlayerOpacity],
  );

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
    return {
      opacity: largePlayerOpacity.value,
      pointerEvents: largePlayerOpacity.value > 0.5 ? "auto" : "none",
    };
  });

  // NEW: Animated style for the mini player container
  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    return {
      opacity: smallPlayerOpacity.value,
      pointerEvents: smallPlayerOpacity.value > 0.5 ? "auto" : "none",
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

  if (tabBarHeight === 0 || playbackState === "idle") {
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
        onAnimate={onAnimate}
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
            colors={colors}
            data={data}
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
