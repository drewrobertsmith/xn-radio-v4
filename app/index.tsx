import { useAppTheme } from "@/components/ui/theme-provider";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { Track } from "@/context/audio-context";
import PlayButton from "@/components/play-button";
import { Station } from "@/types/types";

const XN_URL =
  "https://playerservices.streamtheworld.com/api/livestream-redirect/XNRD.mp3";

const XN_STATION: Track = {
  id: "XNRD",
  url: XN_URL,
  title: "XN Radio LIVE",
  artist: "XN Radio",
};

const XN: Station = {
  Id: "XNRD",
  name: "Xn Radio",
  callLetters: "XNRD",
  stream: XN_URL,
};

export default function Index() {
  const xnLogo = require("../assets/images/splash-icon.png");
  const { colors } = useAppTheme();

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
        <Text className="text-lg" style={{ color: colors.text }}>
          Live Stream Metadata
        </Text>
        <PlayButton
          track={XN_STATION}
          size={88}
          color={colors.secondary}
          item={XN}
        />
      </View>
    </View>
  );
}
