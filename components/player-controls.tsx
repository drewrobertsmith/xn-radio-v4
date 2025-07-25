import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";
import PlayButton from "./play-button";
import { useAppTheme } from "./ui/theme-provider";
import { useAudio } from "@/context/audio-context";

export default function PlayerControls() {
  const { colors } = useAppTheme();
  const { currentTrack, player, seekTo } = useAudio();

  if (currentTrack?.isLiveStream) {
    return (
      <View className="flex-row items-center gap-5">
        <PlayButton track={currentTrack} size={88} color={colors.secondary} />
      </View>
    );
  } else {
    return (
      <View className="flex-row items-center gap-5">
        <Pressable
          onPress={() => {
            seekTo(player.currentTime - 15);
          }}
        >
          <View className="relative h-24 w-24 items-center justify-center">
            <MaterialIcons name="replay" size={72} color={colors.secondary} />
            <Text
              className="absolute text-sm font-bold bottom-1/3"
              style={{ color: colors.secondary }}
            >
              15
            </Text>
          </View>
        </Pressable>
        <PlayButton track={currentTrack} size={88} color={colors.secondary} />
        <Pressable
          onPress={() => {
            seekTo(player.currentTime + 30);
          }}
        >
          <View className="relative h-24 w-24 items-center justify-center">
            <MaterialIcons
              name="replay"
              size={72}
              color={colors.secondary}
              className="transform scale-x-[-1]"
            />
            <Text
              className="absolute text-sm font-bold bottom-1/3"
              style={{ color: colors.secondary }}
            >
              30
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }
}
