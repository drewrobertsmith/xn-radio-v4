import { Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import Separator from "../ui/separator";
import { RenderTrackDuration } from "../duration";
import DescriptionHTML from "../description-html";
import { useActiveTrack } from "react-native-track-player";

export default function DetailsScreen() {
  const { colors } = useAppTheme();
  const currentTrack = useActiveTrack();

  if (!currentTrack) {
    return null;
  }

  return (
    <View
      className="flex-1 p-4 text gap-2"
      style={{ backgroundColor: colors.card }}
    >
      <Text className="text-lg font-bold" style={{ color: colors.text }}>
        {currentTrack?.title}
      </Text>
      {!currentTrack.duration ? (
        <Text className="font-semibold" style={{ color: colors.error }}>
          ON AIR
        </Text>
      ) : (
        <Text style={{ color: colors.secondaryText }}>
          <RenderTrackDuration track={currentTrack} />
        </Text>
      )}
      <Separator />
      <DescriptionHTML description={currentTrack.descriptionHTML} />
    </View>
  );
}
