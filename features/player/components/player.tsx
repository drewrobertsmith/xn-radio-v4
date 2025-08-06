import { usePlayerBottomSheet } from "@/hooks/usePlayerBottomSheet";
import { PlayerContext } from "@/context/player-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudio } from "@/context/audio-context";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Dimensions } from "react-native";
import { PlayerUI } from "./player-ui";
import { useAppTheme } from "@/components/ui/theme-provider";

const { height: screenHeight, width } = Dimensions.get("window");

export const Player = () => {
  const {
    bottomSheetRef,
    animatedIndex,
    largePlayerOpacity,
    smallPlayerOpacity,
    snapPoints,
    expand,
    collapse,
    onAnimate,
    tabBarHeight,
  } = usePlayerBottomSheet();
  const area = useSafeAreaInsets();
  const { player } = useAudio();
  const { colors } = useAppTheme();

  const { id, playbackState } = useSelector(() => {
    return {
      id: audio$.currentTrack.id.get(),
      playbackState: audio$.playbackState.get(),
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    const size = interpolate(animatedIndex.value, [0, 1], [50, width - 24]);
    const borderRadius = interpolate(animatedIndex.value, [0, 1], [8, 16]);

    return {
      width: size,
      height: size,
      borderRadius,
    };
  });

  const animatedFullPlayerStyle = useAnimatedStyle(() => {
    return {
      opacity: largePlayerOpacity.value,
      pointerEvents: largePlayerOpacity.value > 0.5 ? "auto" : "none",
    };
  });

  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    return {
      opacity: smallPlayerOpacity.value,
      pointerEvents: smallPlayerOpacity.value > 0.5 ? "auto" : "none",
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

  if (tabBarHeight === 0 || playbackState === "idle") {
    return null;
  }

  return (
    <PlayerContext.Provider
      value={{
        animatedImageStyle,
        animatedFullPlayerStyle,
        animatedMiniPlayerStyle,
        onExpand: expand,
        onCollapse: collapse,
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            padding: 8,
            height: screenHeight,
          },
          animatedPadding,
        ]}
        pointerEvents="box-none"
      >
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          animatedIndex={animatedIndex}
          enableDynamicSizing={false}
          onAnimate={onAnimate}
          enablePanDownToClose={true}
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
            <PlayerUI />
          </BottomSheetView>
        </BottomSheet>
      </Animated.View>
    </PlayerContext.Provider>
  );
};
