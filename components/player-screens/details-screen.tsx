import { Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import { formatDuration } from "@/utils/formatters";
import Separator from "../ui/separator";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import RenderDuration, { RenderTrackDuration } from "../duration";

export default function DetailsScreen() {
  const { colors } = useAppTheme();

  const { title, description, isLiveStream, currentTrack } = use$(() => {
    return {
      title: audio$.currentTrack.title.get(),
      isLiveStream: audio$.currentTrack.isLiveStream.get(),
      description: audio$.currentTrack.description.get(),
      currentTrack: audio$.currentTrack.get(),
    };
  });
  //TODO: fix RenderDuration needing a clip object rather than track object

  return (
    <View
      className="flex-1 p-4 text gap-2"
      style={{ backgroundColor: colors.card }}
    >
      <Text className="text-lg font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
      {isLiveStream ? (
        <Text className="font-semibold" style={{ color: colors.error }}>
          On-Air Now
        </Text>
      ) : (
        <Text style={{ color: colors.text }}>
          {RenderTrackDuration(currentTrack)}
        </Text>
      )}
      <Separator />
      <Text className="text-base" style={{ color: colors.text }}>
        {description}
      </Text>
    </View>
  );
}
