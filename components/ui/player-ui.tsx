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
  isExpanded: boolean;
}

function PlayerUIComponent({
  animatedFullPlayerStyle,
  animatedMiniPlayerStyle,
  onExpand,
  onCollapse,
  isExpanded,
}: PlayerUIProps) {
  return (
    <>
      <MiniPlayer
        animatedMiniPlayerStyle={animatedMiniPlayerStyle}
        onExpand={onExpand}
      />
      {isExpanded && (
        <FullScreenPlayer
          animatedFullPlayerStyle={animatedFullPlayerStyle}
          onCollapse={onCollapse}
        />
      )}
    </>
  );
}

export const PlayerUI = React.memo(PlayerUIComponent);
