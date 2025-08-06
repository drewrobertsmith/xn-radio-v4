import { Text, View } from "react-native";
import { useAppTheme } from "@/components/ui/theme-provider";
import { formatDuration } from "@/utils/formatters";
import Separator from "@/components/ui/separator";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export default function DetailsScreen() {
  const { colors } = useAppTheme();

  const { title, duration, description, isLiveStream } = useSelector(() => {
    return {
      title: audio$.currentTrack.title.get(),
      isLiveStream: audio$.currentTrack.isLiveStream.get(),
      duration: audio$.currentTrack.duration.get(),
      description: audio$.currentTrack.description.get(),
    };
  });

  return (
    <BottomSheetScrollView
      className="flex-1 p-4 text gap-2"
      style={{ backgroundColor: colors.card }}
    >
      <Text className="text-lg font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
      {isLiveStream ? (
        <Text className="font-semibold color-red-500">On-Air Now</Text>
      ) : (
        <Text style={{ color: colors.text }}>
          {formatDuration(duration, "summary")}
        </Text>
      )}
      <Separator />
      <Text className="text-base" style={{ color: colors.text }}>
        {description}
      </Text>
    </BottomSheetScrollView>
  );
}
