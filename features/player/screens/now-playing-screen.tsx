import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import PlayerControls from "@/components/player-controls";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/ui/theme-provider";
import ProgressBar from "@/components/progress-bar";
import { useMetadata } from "@/hooks/useMetadata";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { usePlayerContext } from "@/context/player-context";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function NowPlayingScreen() {
  const { colors } = useAppTheme();
  const { animatedImageStyle } = usePlayerContext();
  const { id, title, artwork, isLiveStream } = useSelector(() => {
    return {
      id: audio$.currentTrack.id.get(),
      title: audio$.currentTrack.title.get(),
      artwork: audio$.currentTrack.artwork.get(),
      isLiveStream: audio$.currentTrack.isLiveStream.get(),
    };
  });
  const { data } = useMetadata(id, 1);

  const handleSecondaryText = () => {
    if (id === "XNRD") {
      return (
        <Text className="text-sm" style={{ color: colors.secondaryText }}>
          {data?.track_artist_name}
        </Text>
      );
    }
    return null;
  };

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
