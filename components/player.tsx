import { useLayout } from "@/context/layout-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Dimensions,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  AnimatedStyle,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme, XNTheme } from "./ui/theme-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlayButton from "./play-button";
import { Track, useAudio } from "@/context/audio-context";
import { useMetadata } from "@/hooks/useMetadata";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Metadata } from "@/types/types";

const { height: screenHeight, width } = Dimensions.get("window");
const MINI_PLAYER_HEIGHT = 64;

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

interface PlayerUIProps {
  colors: XNTheme["colors"];
  currentTrack: Track | null;
  data: Metadata | null | undefined;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onExpand: () => void;
  onCollapse: () => void;
  handleSecondaryText: () => React.ReactNode;
}

function PlayerUIComponent({
  colors,
  currentTrack,
  data,
  animatedImageStyle,
  animatedFullPlayerStyle,
  animatedMiniPlayerStyle,
  onExpand,
  onCollapse,
  handleSecondaryText,
}: PlayerUIProps) {
  return (
    <>
      {/* --- Full Screen Player --- */}
      <Animated.View
        style={[styles.fullPlayerContainer, animatedFullPlayerStyle]}
        // The full player is only interactive when it's visible
      >
        <Pressable onPress={onCollapse} style={styles.collapseButton}>
          <MaterialIcons name="arrow-drop-down" size={32} color={colors.text} />
        </Pressable>
        <AnimatedExpoImage
          source={currentTrack?.artwork}
          style={[animatedImageStyle]}
        />
        <View style={styles.fullTrackInfo}>
          <Text
            style={[styles.fullTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {currentTrack?.id === "XNRD"
              ? data?.cue_title
              : currentTrack?.title}
          </Text>
          {handleSecondaryText()}
        </View>
        <View style={styles.fullControls}>
          <PlayButton track={currentTrack} size={88} color={colors.secondary} />
        </View>
      </Animated.View>

      {/* --- Mini Player --- */}
      <Pressable
        onPress={onExpand}
        // The mini player is only interactive when it's visible
      >
        <Animated.View
          style={[styles.miniPlayerContainer, animatedMiniPlayerStyle]}
        >
          <AnimatedExpoImage
            source={currentTrack?.artwork}
            contentFit="contain"
            style={[
              styles.albumArt,
              { borderColor: colors.border, borderWidth: 1 },
              animatedImageStyle,
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
        </Animated.View>
      </Pressable>
    </>
  );
}

const PlayerUI = memo(PlayerUIComponent);

export const Player = () => {
  const { colors } = useAppTheme();
  const { tabBarHeight } = useLayout();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const area = useSafeAreaInsets();
  const { currentTrack, playbackState } = useAudio();
  const { data } = useMetadata(currentTrack?.id, 1);

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
      console.log(`Animating from ${fromIndex} to ${toIndex}`);
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
      // This logic now runs on the UI thread, which is correct!
      pointerEvents: largePlayerOpacity.value > 0.5 ? "auto" : "none",
    };
  });

  // NEW: Animated style for the mini player container
  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    return {
      opacity: smallPlayerOpacity.value,
      // This logic also runs on the UI thread.
      pointerEvents: smallPlayerOpacity.value > 0.5 ? "auto" : "none",
    };
  });

  const handleSecondaryText = useCallback(() => {
    if (currentTrack?.id === "XNRD") {
      return (
        <Text className="text-sm" style={{ color: colors.secondaryText }}>
          {data?.track_artist_name}
        </Text>
      );
    }
    return null;
  }, [currentTrack?.id, data?.track_artist_name, colors.secondaryText]);

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
        <BottomSheetView style={styles.contentContainer} pointerEvents="auto">
          <PlayerUI
            colors={colors}
            currentTrack={currentTrack}
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
  },
  fullPlayerContainer: {
    position: "absolute",
    // Add your full screen player styles here
    alignItems: "center",
    justifyContent: "center",
  },
  collapseButton: {
    padding: 8, // Increases touchable area
  },
  fullTrackInfo: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  fullTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  fullControls: {
    marginTop: 40,
  },
  miniPlayerContainer: {
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
