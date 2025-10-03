import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import PlayerControls from "../player-controls";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import ProgressBar from "../progress-bar";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { use$ } from "@legendapp/state/react";
import { useCallback } from "react";
import { useMetadata } from "@/src/hooks/useMetadata";
import { usePlayerAnimation } from "@/src/context/player-animation-context";
import { useActiveTrack } from "react-native-track-player";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function NowPlayingScreen() {
  const { colors } = useAppTheme();
  const { data } = useMetadata("XNRD", 1);
  const { animatedImageStyle, animatedImageContainerStyle } =
    usePlayerAnimation();
  // const { title, artwork, id, isLiveStream } = use$(() => {
  //   return {
  //     id: audio$.currentTrack.id.get(),
  //     title: audio$.currentTrack.title.get(),
  //     artwork: audio$.currentTrack.artwork.get(),
  //     isLiveStream: audio$.currentTrack.isLiveStream.get(),
  //   };
  // });

  const activeTrack = useActiveTrack();

  const handleSecondaryText = useCallback(() => {
    if (activeTrack?.id === "XNRD" && data) {
      return (
        <Text className="text-sm" style={{ color: colors.secondaryText }}>
          {data?.track_artist_name}
        </Text>
      );
    }
    return null;
  }, [activeTrack, data, colors.secondaryText]);

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
      <Animated.View style={[animatedImageContainerStyle]}>
        <AnimatedExpoImage
          source={activeTrack?.artwork}
          style={[{ height: "100%", width: "100%" }, animatedImageStyle]}
          contentFit="cover"
        />
      </Animated.View>
      <View style={styles.fullTrackInfo}>
        <Text
          className="text-center font-semibold text-lg px-1"
          style={{ color: colors.text }}
          numberOfLines={4}
        >
          {activeTrack?.id === "XNRD" ? data?.cue_title : activeTrack?.title}
        </Text>
        {handleSecondaryText()}
      </View>
      {activeTrack?.isLiveStream ? null : <ProgressBar />}
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
