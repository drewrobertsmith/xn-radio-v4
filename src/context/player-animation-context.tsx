import { createContext, useContext } from "react";
import { Dimensions, ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
  AnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface PlayerAnimationContextType {
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  animatedImageContainerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
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

  //Animated Container View
  const animatedImageContainerStyle = useAnimatedStyle(() => {
    const size = interpolate(
      animatedIndex.value,
      [0, 1],
      [50, width - 24], // from 50x50 to full width minus padding
    );
    return {
      width: size,
      height: size,
    };
  });

  // Animated style for the album art image itself
  // only animate properties that don't trigger a native reload, like borderRadius.
  const animatedImageStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      animatedIndex.value,
      [0, 1],
      [8, 16], // from rounded corners to larger rounded corners
    );

    return {
      borderRadius,
    };
  });

  return (
    <PlayerAnimationContext.Provider
      value={{
        animatedImageStyle,
        animatedImageContainerStyle,
        screenHeight,
        width,
        animatedIndex,
      }}
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
