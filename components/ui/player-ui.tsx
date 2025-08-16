import { XNTheme } from "./theme-provider";
import { Metadata } from "@/types/types";
import { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import { memo } from "react";
import FullScreenPlayer from "../full-screen-player";
import MiniPlayer from "../mini-player";

interface PlayerUIProps {
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onExpand: () => void;
  onCollapse: () => void;
  handleSecondaryText: () => React.ReactNode;
}

function PlayerUIComponent({
  animatedImageStyle,
  animatedFullPlayerStyle,
  animatedMiniPlayerStyle,
  onExpand,
  onCollapse,
  handleSecondaryText,
}: PlayerUIProps) {
  return (
    <>
      <MiniPlayer
        animatedMiniPlayerStyle={animatedMiniPlayerStyle}
        onExpand={onExpand}
        animatedImageStyle={animatedImageStyle}
        handleSecondaryText={handleSecondaryText}
      />
      <FullScreenPlayer
        animatedFullPlayerStyle={animatedFullPlayerStyle}
        onCollapse={onCollapse}
        animatedImageStyle={animatedImageStyle}
        handleSecondaryText={handleSecondaryText}
      />
    </>
  );
}

export const PlayerUI = memo(PlayerUIComponent);
