import { useAppTheme } from "@/components/ui/theme-provider";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { Track } from "@/context/audio-context";
import PlayButton from "@/components/play-button";
import { useMetadata } from "@/hooks/useMetadata";

const XN_URL =
  "https://playerservices.streamtheworld.com/api/livestream-redirect/XNRD.mp3";

const XN: Track = {
  id: "XNRD",
  url: XN_URL,
  title: "XN Radio LIVE",
  artist: "XN Radio",
};

export default function Index() {
  const xnLogo = require("../assets/images/splash-icon.png");
  const { colors } = useAppTheme();
  const { data } = useMetadata(XN.id, 1);

  return (
    <View className="flex-1 justify-between items-center">
      <View className="items-center justify-evenly">
        <Image
          source={xnLogo}
          contentFit="contain"
          cachePolicy="memory-disk"
          style={{
            aspectRatio: 1,
            height: "60%",
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
        <View className="items-center">
          <Text className="text-lg" style={{ color: colors.text }}>
            {data?.cue_title}
          </Text>
          <Text className="text-md" style={{ color: colors.secondaryText }}>
            {data?.track_artist_name}
          </Text>
        </View>

        <PlayButton size={88} track={XN} color={colors.secondary} />
      </View>
    </View>
  );
}
