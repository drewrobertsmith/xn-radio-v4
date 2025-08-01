import React from "react";
import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { XNTheme } from "./ui/theme-provider";
import { Metadata } from "@/types/types";
import { Image } from "expo-image";
import PlayButton from "./play-button";
import { audio$, Track } from "@/state/audio";
import { useSelector } from "@legendapp/state/react";

interface MiniPlayerProps {
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  onExpand: () => void;
  handleSecondaryText: () => React.ReactNode;
  colors: XNTheme["colors"];
  data: Metadata | null | undefined;
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function MiniPlayer({
  animatedMiniPlayerStyle,
  onExpand,
  animatedImageStyle,
  handleSecondaryText,
  colors,
  data,
}: MiniPlayerProps) {
  // ✅ ONE subscription gets the whole object.
  const currentTrack = useSelector(audio$.currentTrack);

  // ✅ Then, derive the other values from the result. No more selectors needed.
  // This is just plain JavaScript, running after the component re-renders.
  const title = currentTrack?.title;
  const id = currentTrack?.id;
  const artwork = currentTrack?.artwork;

  // If there's no track, we can't render, so return null.
  if (!currentTrack) {
    // Or return a placeholder view. This prevents errors on the line below.
    return null;
  }

  return (
    <Pressable
      onPress={onExpand}
    //
    //The mini player is only interactive when it's visible
    >
      <Animated.View
        style={[styles.miniPlayerContainer, animatedMiniPlayerStyle]}
      >
        <AnimatedExpoImage
          source={artwork}
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
            {id === "XNRD" ? data?.cue_title : title}
          </Text>
          {handleSecondaryText()}
        </View>
        <PlayButton track={currentTrack} size={44} color={colors.secondary} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
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
