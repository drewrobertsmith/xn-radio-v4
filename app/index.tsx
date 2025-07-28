import { useAppTheme } from "@/components/ui/theme-provider";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { Track } from "@/context/audio-context";
import PlayButton from "@/components/play-button";
import { useMetadata } from "@/hooks/useMetadata";
import * as MediaControls from "../modules/media-controls";

const XN_URL =
  "https://playerservices.streamtheworld.com/api/livestream-redirect/XNRD.mp3";
const xnLogo = require("../assets/images/splash-icon.png");

const XN: Track = {
  id: "XNRD",
  url: XN_URL,
  title: "XN Radio LIVE",
  artist: "XN Radio",
  artwork: xnLogo,
  isLiveStream: true,
};

export default function Index() {
  const { colors } = useAppTheme();
  const { data } = useMetadata(XN.id, 1);

  return (
    <View className="flex-1 justify-between items-center">
      <View className="items-center justify-evenly">
        <Text>{MediaControls.hello()}</Text>
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
            {data ? data?.cue_title : "XN Radio"}
          </Text>
          <Text className="text-md" style={{ color: colors.secondaryText }}>
            {data ? data?.track_artist_name : null}
          </Text>
        </View>

        <PlayButton size={88} track={XN} color={colors.secondary} />
      </View>
    </View>
  );
}
