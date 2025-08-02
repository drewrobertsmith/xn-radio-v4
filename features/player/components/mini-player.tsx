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
import { useAppTheme } from "@/components/ui/theme-provider";
import { Image } from "expo-image";
import PlayButton from "@/components/play-button";
import { audio$ } from "@/state/audio";
import { useSelector } from "@legendapp/state/react";
import { usePlayerContext } from "@/context/player-context";

interface MiniPlayerProps {
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function MiniPlayer({
  animatedMiniPlayerStyle,
  animatedImageStyle,
}: MiniPlayerProps) {
  const { onExpand } = usePlayerContext();
  const { colors } = useAppTheme();
  const currentTrack = useSelector(audio$.currentTrack);

  const title = currentTrack?.title;
  const id = currentTrack?.id;
  const artwork = currentTrack?.artwork;

  if (!currentTrack) {
    return null;
  }

  return (
    <Pressable onPress={onExpand}>
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
            {title}
          </Text>
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