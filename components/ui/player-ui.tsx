import { Track } from "@/context/audio-context";
import { XNTheme } from "./theme-provider";
import { Metadata } from "@/types/types";
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
import { Image } from "expo-image";
import { memo } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PlayButton from "../play-button";
import FullScreenPlayer from "../full-screen-player";
import MiniPlayer from "../mini-player";

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

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

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
      <FullScreenPlayer
        animatedFullPlayerStyle={animatedFullPlayerStyle}
        onCollapse={onCollapse}
        animatedImageStyle={animatedImageStyle}
        handleSecondaryText={handleSecondaryText}
        colors={colors}
        currentTrack={currentTrack}
        data={data}
      />
      <MiniPlayer
        animatedMiniPlayerStyle={animatedMiniPlayerStyle}
        onExpand={onExpand}
        animatedImageStyle={animatedImageStyle}
        handleSecondaryText={handleSecondaryText}
        colors={colors}
        currentTrack={currentTrack}
        data={data}
      />
    </>
  );
}

export const PlayerUI = memo(PlayerUIComponent);
