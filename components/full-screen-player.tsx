import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import {
  ImageStyle,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import PlayButton from "./play-button";
import { useAppTheme, XNTheme } from "./ui/theme-provider";
import { Track, useAudio } from "@/context/audio-context";
import { Metadata } from "@/types/types";
import { AudioPlayer, AudioStatus } from "expo-audio";
import ProgressBar from "./progress-bar";
import PlayerControls from "./player-controls";

interface FullScreenPlayerProps {
  animatedFullPlayerStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  onCollapse: () => void;
  handleSecondaryText: () => React.ReactNode;
  data: Metadata | null | undefined;
}

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function FullScreenPlayer({
  animatedFullPlayerStyle,
  onCollapse,
  animatedImageStyle,
  handleSecondaryText,
  data,
}: FullScreenPlayerProps) {
  const { colors } = useAppTheme();
  const { currentTrack } = useAudio();

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
          className="text-center font-semibold text-lg px-1"
          style={{ color: colors.text }}
          numberOfLines={4}
        >
          {currentTrack?.id === "XNRD" ? data?.cue_title : currentTrack?.title}
        </Text>
        {handleSecondaryText()}
      </View>
      {currentTrack?.isLiveStream ? null : <ProgressBar />}
      <PlayerControls />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  fullPlayerContainer: {
    position: "absolute",
    // Add your full screen player styles here
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  collapseButton: {
    padding: 8, // Increases touchable area
  },
  fullTrackInfo: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
});
