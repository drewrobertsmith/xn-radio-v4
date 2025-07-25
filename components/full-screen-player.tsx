import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import PlayButton from "./play-button";
import { XNTheme } from "./ui/theme-provider";
import { Track } from "@/context/audio-context";
import { Metadata } from "@/types/types";

interface FullScreenPlayerProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  onCollapse: () => void;
  handleSecondaryText: () => React.ReactNode;
  colors: XNTheme["colors"];
  currentTrack: Track | null;
  data: Metadata | null | undefined;
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function FullScreenPlayer({
  animatedFullPlayerStyle,
  onCollapse,
  animatedImageStyle,
  handleSecondaryText,
  colors,
  currentTrack,
  data,
}: FullScreenPlayerProps) {
  return (
    <Animated.View
      style={[styles.fullPlayerContainer, animatedFullPlayerStyle]}
      // The full player is only interactive when it's visible
    >
      <Pressable onPress={onCollapse} style={styles.collapseButton}>
        <MaterialIcons name="arrow-drop-down" size={32} color={colors.text} />
      </Pressable>
      <AnimatedExpoImage
        source={currentTrack?.artwork}
        style={[animatedImageStyle]}
      />
      <View style={styles.fullTrackInfo}>
        <Text
          style={[styles.fullTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {currentTrack?.id === "XNRD" ? data?.cue_title : currentTrack?.title}
        </Text>
        {handleSecondaryText()}
      </View>
      <View style={styles.fullControls}>
        <PlayButton track={currentTrack} size={88} color={colors.secondary} />
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  fullPlayerContainer: {
    position: "absolute",
    // Add your full screen player styles here
    alignItems: "center",
    justifyContent: "center",
  },
  collapseButton: {
    padding: 8, // Increases touchable area
  },
  fullTrackInfo: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  fullTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  fullControls: {
    marginTop: 40,
  },
});
