import { Program } from "@/types/types";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { useRouter } from "expo-router";

export default function ProgramItem({ item }: { item: Program }) {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate(`/${item.Id}`);
      }}
    >
      <View className="items-center">
        <Image
          source={item.ArtworkUrl}
          contentFit="contain"
          cachePolicy="memory-disk"
          // transition={500}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
        <Text
          style={{ color: colors.text }}
          className="text-sm text-center p-1 font-semibold"
        >
          {item.Name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
