import { Image } from "expo-image";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import PlayerControls from "../player-controls";
import { ImageStyle, StyleProp, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import ProgressBar from "../progress-bar";
import { Metadata } from "@/types/types";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { useMetadata } from "@/hooks/useMetadata";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

interface NowPlayingScreenProps {
  animatedImageStyle: StyleProp<AnimatedStyle<ImageStyle>>;
  handleSecondaryText: () => React.ReactNode;
  data: Metadata | null | undefined;
}

export default function NowPlayingScreen({
  animatedImageStyle,
  handleSecondaryText,
}: NowPlayingScreenProps) {
  const { colors } = useAppTheme();
  const { data } = useMetadata("XNRD", 1);
  const { title, artwork, id, isLiveStream } = use$(() => {
    return {
      id: audio$.currentTrack.id.get(),
      title: audio$.currentTrack.title.get(),
      artwork: audio$.currentTrack.artwork.get(),
      isLiveStream: audio$.currentTrack.isLiveStream.get(),
    };
  });

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
      <AnimatedExpoImage source={artwork} style={[animatedImageStyle]} />
      <View style={styles.fullTrackInfo}>
        <Text
          className="text-center font-semibold text-lg px-1"
          style={{ color: colors.text }}
          numberOfLines={4}
        >
          {id === "XNRD" ? data?.cue_title : title}
        </Text>
        {handleSecondaryText()}
      </View>
      {isLiveStream ? null : <ProgressBar />}
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
