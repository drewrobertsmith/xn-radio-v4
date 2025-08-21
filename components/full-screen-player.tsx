import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import NowPlayingScreen from "./player-screens/now-playing-screen";
import ThemeProvider, { useAppTheme } from "./ui/theme-provider";
import DetailsScreen from "./player-screens/details-screen";
import QueueScreen from "./player-screens/queue-screen";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { createContext, useContext, useEffect } from "react";

interface AnimationCompletionContextType {
  isAnimationComplete: boolean;
}
const AnimationCompletionContext =
  createContext<AnimationCompletionContextType>({
    isAnimationComplete: false,
  });

interface FullScreenPlayerProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onCollapse: () => void;
  isAnimationComplete: boolean;
}

const AnimatedTabBar = (props: MaterialTopTabBarProps) => {
  const { isAnimationComplete } = useContext(AnimationCompletionContext);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // When the animation is complete, fade the tab bar in.
    // When collapsing, it will instantly disappear as the parent unmounts.
    if (isAnimationComplete) {
      opacity.value = withTiming(1, { duration: 250 });
    }
  }, [isAnimationComplete, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialTopTabBar {...props} />
    </Animated.View>
  );
};

const Tab = createMaterialTopTabNavigator();

const PlayerTabNavigator = ({ onCollapse }: { onCollapse: () => void }) => {
  const { colors } = useAppTheme();
  const queueLength = use$(() => audio$.queue.total.get());

  const TabBarBadge = () => (
    <View
      className="rounded-full p-1 aspect-square justify-center items-center"
      style={{ backgroundColor: colors.secondary }}
    >
      <Text className="text-xs font-semibold" style={{ color: colors.card }}>
        {queueLength}
      </Text>
    </View>
  );

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <ThemeProvider>
          <Tab.Navigator
            // Here is the key: we provide our custom animated component
            // to render the tab bar.
            tabBar={(props) => <AnimatedTabBar {...props} />}
            screenOptions={{
              tabBarStyle: {
                elevation: 0,
              },
            }}
          >
            <Tab.Screen name="Now Playing">
              {(props) => (
                <NowPlayingScreen {...props} onCollapse={onCollapse} />
              )}
            </Tab.Screen>
            <Tab.Screen name="Details" component={DetailsScreen} />
            <Tab.Screen
              name="Queue"
              component={QueueScreen}
              options={{
                tabBarBadge: () => <TabBarBadge />,
              }}
            />
            {/* Note: The TabBarBadge logic would now move inside QueueScreen
                or be handled via navigator options if needed. For simplicity,
                I've removed it from this component. */}
          </Tab.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default function FullScreenPlayer({
  animatedFullPlayerStyle,
  onCollapse,
  isAnimationComplete,
}: FullScreenPlayerProps) {
  return (
    <Animated.View
      style={[styles.fullPlayerContainer, animatedFullPlayerStyle]}
      renderToHardwareTextureAndroid={true}
    >
      {/*
        We wrap the navigator in our context provider.
        This allows the AnimatedTabBar deep inside the tree to know
        when the parent animation is complete.
      */}
      <AnimationCompletionContext.Provider value={{ isAnimationComplete }}>
        <PlayerTabNavigator onCollapse={onCollapse} />
      </AnimationCompletionContext.Provider>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullPlayerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  collapseButton: {
    padding: 8, // Increases touchable area
  },
});
