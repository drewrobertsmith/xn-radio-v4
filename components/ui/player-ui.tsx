import { Track } from "@/context/audio-context";
import { XNTheme } from "./theme-provider";
import { Metadata } from "@/types/types";
import { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import { memo } from "react";
import FullScreenPlayer from "../full-screen-player";
import MiniPlayer from "../mini-player";
import { AudioPlayer, AudioStatus } from "expo-audio";

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
  status: AudioStatus | null;
  player: AudioPlayer;
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
  status,
  player,
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
        status={status}
        player={player}
      />
      <MiniPlayer
        animatedMiniPlayerStyle={animatedMiniPlayerStyle}
        onExpand={onExpand}
        animatedImageStyle={animatedImageStyle}
        handleSecondaryText={handleSecondaryText}
        colors={colors}
        currentTrack={currentTrack}
        data={data}
        status={status}
        player={player}
      />
    </>
  );
}

export const PlayerUI = memo(PlayerUIComponent);
