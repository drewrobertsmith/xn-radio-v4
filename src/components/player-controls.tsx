import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import PlayButton from "./play-button";
import { useAppTheme } from "./ui/theme-provider";
import { useActiveTrack, useProgress } from "react-native-track-player";

export default function PlayerControls() {
  const { colors } = useAppTheme();
  const currentTrack = useActiveTrack();
  const currentProgress = useProgress();

  if (!currentTrack) {
    return null;
  }

  if (currentTrack.isLiveStream) {
    return (
      <View className="flex-row items-center gap-5">
        <PlayButton
          track={currentTrack}
          size={112}
          color={colors.secondary}
          isLiveStream={currentTrack.isLiveStream}
        />
      </View>
    );
  } else {
    return (
      <View className="flex-row items-center gap-5">
        <TouchableOpacity
          onPress={() => {
            // TODO: Move to async controller file
            // seekTo(currentProgress.position - 15);
          }}
        >
          <View className="relative h-24 w-24 items-center justify-center">
            <MaterialIcons name="replay" size={64} color={colors.secondary} />
            <Text
              className="absolute text-sm font-bold bottom-1/3"
              style={{ color: colors.secondaryText }}
            >
              15
            </Text>
          </View>
        </TouchableOpacity>
        <PlayButton
          track={currentTrack}
          size={112}
          color={colors.secondary}
          isLiveStream={currentTrack.isLiveStream}
        />
        <TouchableOpacity
          onPress={() => {
            // TODO: Move to async controller file
            // seekTo(currentProgress.position + 30);
          }}
        >
          <View className="relative h-24 w-24 items-center justify-center">
            <MaterialIcons
              name="replay"
              size={64}
              color={colors.secondary}
              style={{
                transform: [
                  {
                    scaleX: -1,
                  },
                ],
              }}
            />
            <Text
              className="absolute text-sm font-bold bottom-1/3"
              style={{ color: colors.secondaryText }}
            >
              30
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
