import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NowPlayingScreen from "./player-screens/now-playing-screen";
import ThemeProvider, { useAppTheme } from "./ui/theme-provider";
import DetailsScreen from "./player-screens/details-screen";
import QueueScreen from "./player-screens/queue-screen";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

interface FullScreenPlayerProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  onCollapse: () => void;
}

const Tab = createMaterialTopTabNavigator();

export default function FullScreenPlayer({
  animatedFullPlayerStyle,
}: FullScreenPlayerProps) {
  const { colors } = useAppTheme();
  const queueLength = use$(() => audio$.queue.total.get());

  const TabBarBadge = () => {
    return (
      <View
        className="rounded-full p-1 aspect-square justify-center items-center"
        style={{ backgroundColor: colors.secondary }}
      >
        <Text className="text-xs font-semibold" style={{ color: colors.card }}>
          {queueLength}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[styles.fullPlayerContainer, animatedFullPlayerStyle]}
    // The full player is only interactive when it's visible
    >
      <View style={{ flex: 1 }}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <ThemeProvider
            //a second theme provider is needed since this is an independent nav tree for themeing
            >
              <Tab.Navigator>
                <Tab.Screen name="Now Playing" component={NowPlayingScreen} />
                <Tab.Screen name="Details" component={DetailsScreen} />
                <Tab.Screen
                  name="Queue"
                  component={QueueScreen}
                  options={{
                    tabBarBadge: () => <TabBarBadge />,
                  }}
                />
              </Tab.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
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
