import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { Metadata } from "@/types/types";
import { useCallback } from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NowPlayingScreen from "./player-screens/now-playing-screen";
import ThemeProvider from "./ui/theme-provider";
import DetailsScreen from "./player-screens/details-screen";

interface FullScreenPlayerProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  onCollapse: () => void;
  handleSecondaryText: () => React.ReactNode;
  data: Metadata | null | undefined;
}

const Tab = createMaterialTopTabNavigator();

const QueueScreen = () => {
  return (
    <View className="flex-1">
      <Text>Queue Screen</Text>
    </View>
  );
};

export default function FullScreenPlayer({
  animatedFullPlayerStyle,
  animatedImageStyle,
  handleSecondaryText,
  data,
}: FullScreenPlayerProps) {
  //Nav container in full screen player
  const PlayerTabs = useCallback(() => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Now Playing">
          {() => (
            <NowPlayingScreen
              animatedImageStyle={animatedImageStyle}
              data={data}
              handleSecondaryText={handleSecondaryText}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Details">{() => <DetailsScreen />}</Tab.Screen>
        <Tab.Screen name="Queue" component={QueueScreen} />
      </Tab.Navigator>
    );
  }, [animatedImageStyle, data, handleSecondaryText]);

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
              <PlayerTabs />
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
