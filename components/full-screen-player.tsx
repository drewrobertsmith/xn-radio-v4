import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle, runOnJS } from "react-native-reanimated";
import { Metadata } from "@/types/types";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";
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

type PlayerTabParamList = {
  "Now Playing": {
    animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
    data: Metadata | null | undefined;
    handleSecondaryText: () => React.ReactNode;
  };
  Details: undefined; // This screen takes no parameters
  Queue: undefined; // This screen also takes no parameters
};

type NowPlayingScreenProps = MaterialTopTabScreenProps<
  PlayerTabParamList,
  "Now Playing"
>;

const NowPlayingScreenComponent = (props: NowPlayingScreenProps) => (
  <NowPlayingScreen
    animatedImageStyle={props.route.params.animatedImageStyle}
    data={props.route.params.data}
    handleSecondaryText={props.route.params.handleSecondaryText}
  />
);

const DetailsScreenComponent = () => <DetailsScreen />;

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
                <Tab.Screen
                  name="Now Playing"
                  component={NowPlayingScreenComponent}
                  initialParams={{
                    animatedImageStyle,
                    data,
                    handleSecondaryText,
                  }}
                />
                <Tab.Screen name="Details" component={DetailsScreenComponent} />
                <Tab.Screen name="Queue" component={QueueScreen} />
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
