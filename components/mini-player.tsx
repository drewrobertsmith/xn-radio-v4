import React, { useCallback } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useAppTheme } from "./ui/theme-provider";
import { Image } from "expo-image";
import PlayButton from "./play-button";
import { audio$ } from "@/state/audio";
import { use$ } from "@legendapp/state/react";
import { useMetadata } from "@/hooks/useMetadata";
import { usePlayerAnimation } from "@/context/player-animation-context";

interface MiniPlayerProps {
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onExpand: () => void;
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function MiniPlayer({
  animatedMiniPlayerStyle,
  onExpand,
}: MiniPlayerProps) {
  const { title, id, artwork, currentTrack } = use$(() => {
    const currentTrack = audio$.currentTrack.get();
    return {
      currentTrack,
      title: currentTrack?.title,
      id: currentTrack?.id,
      artwork: currentTrack?.artwork,
    };
  });

  const { data } = useMetadata("XNRD", 1);
  const { colors } = useAppTheme();
  const { animatedImageStyle } = usePlayerAnimation();

  const handleMetadataDisplay = useCallback(() => {
    if (id === "XNRD" && data) {
      return data?.cue_title;
    } else if (id === "XNRD" && !data) {
      return "XN Radio Stream";
    } else {
      return title;
    }
  }, [data, id, title]);

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

  if (!currentTrack) {
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
            {handleMetadataDisplay()}
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
