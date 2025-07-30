import { Image } from "expo-image";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import PlayerControls from "../player-controls";
import { ImageStyle, StyleProp, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import { useAudio } from "@/context/audio-context";
import ProgressBar from "../progress-bar";
import { Metadata } from "@/types/types";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

interface NowPlayingScreenProps {
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  handleSecondaryText: () => React.ReactNode;
  data: Metadata | null | undefined;
}

export default function NowPlayingScreen({
  animatedImageStyle,
  data,
  handleSecondaryText,
}: NowPlayingScreenProps) {
  const { colors } = useAppTheme();
  const { currentTrack } = useAudio();

  return (
    <BottomSheetScrollView
      style={{ backgroundColor: colors.card }}
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        gap: 16,
        paddingTop: 16,
      }}
    >
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
    </BottomSheetScrollView>
  );
}
const styles = StyleSheet.create({
  fullTrackInfo: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
});
