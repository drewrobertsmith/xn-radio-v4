import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ThemeProvider, { useAppTheme } from "@/components/ui/theme-provider";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { usePlayerContext } from "@/context/player-context";
import NowPlayingScreen from "../screens/now-playing-screen";
import DetailsScreen from "../screens/details-screen";
import QueueScreen from "../screens/queue-screen";

const Tab = createMaterialTopTabNavigator();

export default function FullScreenPlayer() {
  const { colors } = useAppTheme();
  const queueLength = useSelector(() => audio$.queue.total.get());
  const { animatedFullPlayerStyle, animatedImageStyle } = usePlayerContext();

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
    >
      <View style={{ flex: 1 }}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <ThemeProvider>
              <Tab.Navigator>
                <Tab.Screen
                  name="Now Playing"
                  component={NowPlayingScreen}
                  initialParams={{
                    animatedImageStyle,
                  }}
                />
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
