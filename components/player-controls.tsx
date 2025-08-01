import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";
import PlayButton from "./play-button";
import { useAppTheme } from "./ui/theme-provider";
import { useAudio } from "@/context/audio-context";
import { useSelector } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

export default function PlayerControls() {
  const { colors } = useAppTheme();
  const { player, seekTo } = useAudio();
  const currentTrack = useSelector(audio$.currentTrack);

  if (currentTrack?.isLiveStream) {
    return (
      <View className="flex-row items-center gap-5">
        <PlayButton track={currentTrack} size={88} color={colors.text} />
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
            <MaterialIcons name="replay" size={64} color={colors.text} />
            <Text
              className="absolute text-sm font-bold bottom-1/3"
              style={{ color: colors.secondaryText }}
            >
              15
            </Text>
          </View>
        </Pressable>
        <PlayButton track={currentTrack} size={112} color={colors.text} />
        <Pressable
          onPress={() => {
            seekTo(player.currentTime + 30);
          }}
        >
          <View className="relative h-24 w-24 items-center justify-center">
            <MaterialIcons
              name="replay"
              size={64}
              color={colors.text}
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
        </Pressable>
      </View>
    );
  }
}
