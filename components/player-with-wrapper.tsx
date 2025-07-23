import { useLayout } from "@/context/layout-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useAppTheme } from "./ui/theme-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import PlayButton from "./play-button";
import { useAudio } from "@/context/audio-context";
import { useMetadata } from "@/hooks/useMetadata";

const { height: screenHeight } = Dimensions.get("window");
const MINI_PLAYER_HEIGHT = 64;

const image = require("../assets/images/splash-icon.png");

export const PlayerWithWrapper = () => {
  const { colors } = useAppTheme();
  const { tabBarHeight } = useLayout();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const area = useSafeAreaInsets();
  const { currentTrack, playbackState } = useAudio();
  const { data } = useMetadata(currentTrack?.id, 1);

  const animatedIndex = useSharedValue(0);

  // When using a wrapper, the snap points are relative to the wrapper.
  // For the expanded state, we calculate the full screen height minus the top safe area.
  const snapPoints = useMemo(() => [MINI_PLAYER_HEIGHT, "100%"], []);

  const onAnimate = useCallback((fromIndex: number, toIndex: number) => {
    console.log(`Animating from ${fromIndex} to ${toIndex}`);
  }, []);

  useEffect(() => {
    if (tabBarHeight > 0) {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [tabBarHeight]);

  if (tabBarHeight === 0 || playbackState === "idle") {
    return null;
  }

  const handleSecondaryText = () => {
    if (currentTrack?.id === "XNRD") {
      return (
        <Text className="text-sm" style={{ color: colors.secondaryText }}>
          {data?.track_artist_name}
        </Text>
      );
    } else {
      return null;
    }
  };

  return (
    // 1. The Wrapper View: This is the core of the fix.
    // It creates a container that is ONLY the size of the mini-player.
    <View
      style={[
        styles.wrapper,
        { height: screenHeight - area.top - 8, bottom: tabBarHeight + 4 },
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
        topInset={area.top}
        handleComponent={null}
        containerStyle={{
          borderRadius: 8,
        }}
        backgroundStyle={{
          backgroundColor: colors.card,
        }}
        style={styles.bottomSheet}
      >
        {/* 3. The actual content view. */}
        {/* We set pointerEvents back to "auto" so the mini-player itself is touchable. */}
        <BottomSheetView style={styles.contentContainer} pointerEvents="auto">
          <Image
            source={currentTrack?.artwork}
            contentFit="contain"
            style={[
              styles.albumArt,
              { borderColor: colors.border, borderWidth: 1 },
            ]}
            cachePolicy="none"
          />
          <View className="w-[66%]">
            <Text
              style={{ color: colors.text }}
              numberOfLines={2}
              ellipsizeMode="tail"
              className="text-sm font-semibold"
            >
              {currentTrack?.id === "XNRD"
                ? data?.cue_title
                : currentTrack?.title}
            </Text>
            {handleSecondaryText()}
          </View>
          <PlayButton track={currentTrack} size={44} color={colors.secondary} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 4,
    right: 4,
    padding: 8,
  },
  bottomSheet: {
    // The sheet itself should not have horizontal margin,
    // the wrapper handles it.
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  albumArt: {
    height: 50,
    width: 50,
    borderRadius: 8,
  },
});
