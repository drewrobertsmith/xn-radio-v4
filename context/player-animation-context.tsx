import { createContext, useContext } from "react";
import { Dimensions, ImageStyle, StyleProp } from "react-native";
import {
  AnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface PlayerAnimationContextType {
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  width: number;
  screenHeight: number;
  animatedIndex: SharedValue<number>;
}

const PlayerAnimationContext = createContext<PlayerAnimationContextType | null>(
  null,
);

export const PlayerAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const animatedIndex = useSharedValue(0);

  const { height: screenHeight, width } = Dimensions.get("window");

  // Animated style for the album art
  const animatedImageStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedIndex.value,
      [0, 1],
      [50, width - 24], // from 50x50 to full width minus padding
    );
    const borderRadius = interpolate(
      animatedIndex.value,
      [0, 1],
      [8, 16], // from rounded corners to larger rounded corners
    );

    return {
      width: size,
      height: size,
      borderRadius,
    };
  });

  return (
    <PlayerAnimationContext.Provider
      value={{ animatedImageStyle, screenHeight, width, animatedIndex }}
    >
      {children}
    </PlayerAnimationContext.Provider>
  );
};

export const usePlayerAnimation = () => {
  const context = useContext(PlayerAnimationContext);
  if (!context) {
    throw new Error(
      "usePlayerAnimation must be used within a PlayerAnimationProvider",
    );
  }
  return context;
};
