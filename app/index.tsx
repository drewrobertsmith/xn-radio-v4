import { useAppTheme } from "@/components/ui/theme-provider";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
        <MaterialIcons
          name="play-circle-filled"
          size={88}
          color={colors.secondary}
        />
      </View>
    </View>
  );
}
