import { Alert, Dimensions, Linking, Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import Separator from "../ui/separator";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { RenderTrackDuration } from "../duration";
import RenderHTML from "react-native-render-html";
import { router } from "expo-router";
import Constants from "expo-constants";
import DescriptionHTML from "../description-html";

export default function DetailsScreen() {
  const { colors } = useAppTheme();
  const { width } = Dimensions.get("window");

  const { title, currentTrack } = use$(() => {
    return {
      title: audio$.currentTrack.title.get(),
      isLiveStream: audio$.currentTrack.isLiveStream.get(),
      currentTrack: audio$.currentTrack.get(),
    };
  });
  return (
    <View
      className="flex-1 p-4 text gap-2"
      style={{ backgroundColor: colors.card }}
    >
      <Text className="text-lg font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
      {!currentTrack?.duration ? (
        <Text className="font-semibold" style={{ color: colors.error }}>
          ON AIR
        </Text>
      ) : (
        <Text style={{ color: colors.secondaryText }}>
          <RenderTrackDuration track={currentTrack} />
        </Text>
      )}
      <Separator />
      {/* <Text className="text-base" style={{ color: colors.text }}> */}
      {/*   {description} */}
      {/* </Text> */}
      <DescriptionHTML description={currentTrack?.descriptionHTML} />
    </View>
  );
}
