import { StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import { memo } from "react";
import FullScreenPlayer from "../full-screen-player";
import MiniPlayer from "../mini-player";

interface PlayerUIProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedMiniPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onExpand: () => void;
  onCollapse: () => void;
}

function PlayerUIComponent({
  animatedFullPlayerStyle,
  animatedMiniPlayerStyle,
  onExpand,
  onCollapse,
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
      />
    </>
  );
}

export const PlayerUI = memo(PlayerUIComponent);
