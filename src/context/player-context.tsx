import { createContext, useContext } from "react";
import { AnimatedStyle } from "react-native-reanimated";
import { ImageStyle, ViewStyle } from "react-native";

interface PlayerContextType {
  animatedImageStyle: AnimatedStyle<ImageStyle>;
  animatedFullPlayerStyle: AnimatedStyle<ViewStyle>;
  animatedMiniPlayerStyle: AnimatedStyle<ViewStyle>;
  onExpand: () => void;
  onCollapse: () => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined,
);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};