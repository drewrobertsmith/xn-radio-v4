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
import { Track } from "@/context/audio-context";
import { Metadata } from "@/types/types";
import { Image } from "expo-image";
import PlayButton from "./play-button";

interface MiniPlayerProps {
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  onExpand: () => void;
  handleSecondaryText: () => React.ReactNode;
  colors: XNTheme["colors"];
  currentTrack: Track | null;
  data: Metadata | null | undefined;
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function MiniPlayer({
  animatedMiniPlayerStyle,
  onExpand,
  animatedImageStyle,
  handleSecondaryText,
  colors,
  currentTrack,
  data,
}: MiniPlayerProps) {
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
