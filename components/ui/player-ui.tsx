import { StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import React, { memo } from "react";
import FullScreenPlayer from "../full-screen-player";
import MiniPlayer from "../mini-player";

interface PlayerUIProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onExpand: () => void;
  onCollapse: () => void;
  isAnimationComplete: boolean;
}

function PlayerUIComponent({
  animatedFullPlayerStyle,
  animatedMiniPlayerStyle,
  onExpand,
  onCollapse,
  isAnimationComplete,
}: PlayerUIProps) {
  return (
    <>
      <MiniPlayer
        animatedMiniPlayerStyle={animatedMiniPlayerStyle}
        onExpand={onExpand}
      />
      <FullScreenPlayer
        animatedFullPlayerStyle={animatedFullPlayerStyle}
        onCollapse={onCollapse}
        isAnimationComplete={isAnimationComplete}
      />
    </>
  );
}

export const PlayerUI = React.memo(PlayerUIComponent);
