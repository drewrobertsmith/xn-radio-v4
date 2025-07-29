import { Text, View } from "react-native";
import { useAppTheme } from "../ui/theme-provider";
import { useAudio } from "@/context/audio-context";
import { formatDuration } from "@/utils/formatters";
import Separator from "../ui/separator";

export default function DetailsScreen() {
  const { colors } = useAppTheme();
  const { currentTrack } = useAudio();

  return (
    <View
      className="flex-1 p-4 text gap-2"
      style={{ backgroundColor: colors.card }}
    >
      <Text className="text-lg font-bold" style={{ color: colors.text }}>
        {currentTrack?.title}
      </Text>
      {currentTrack?.isLiveStream ? (
        <Text className="font-semibold color-red-500">On-Air Now</Text>
      ) : (
        <Text style={{ color: colors.text }}>
          {formatDuration(currentTrack?.duration, "summary")}
        </Text>
      )}
      <Separator />
      <Text className="text-base" style={{ color: colors.text }}>
        {currentTrack?.description}
      </Text>
    </View>
  );
}
