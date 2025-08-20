import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import PlayerControls from "../player-controls";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import ProgressBar from "../progress-bar";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { useMetadata } from "@/hooks/useMetadata";
import { useCallback } from "react";
import { usePlayerAnimation } from "@/context/player-animation-context";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function NowPlayingScreen() {
  const { colors } = useAppTheme();
  const { data } = useMetadata("XNRD", 1);
  const { animatedImageStyle } = usePlayerAnimation();
  const { title, artwork, id, isLiveStream } = use$(() => {
    return {
      id: audio$.currentTrack.id.get(),
      title: audio$.currentTrack.title.get(),
      artwork: audio$.currentTrack.artwork.get(),
      isLiveStream: audio$.currentTrack.isLiveStream.get(),
    };
  });

  const handleSecondaryText = useCallback(() => {
    if (id === "XNRD" && data) {
      return (
        <Text className="text-sm" style={{ color: colors.secondaryText }}>
          {data?.track_artist_name}
        </Text>
      );
    }
    return null;
  }, [id, data, colors.secondaryText]);

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
