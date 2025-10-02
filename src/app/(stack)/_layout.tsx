import { useAppTheme } from "@/src/components/ui/theme-provider";
import { Stack } from "expo-router";

export default function PodcastLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Podcasts",
        }}
      />
      <Stack.Screen
        name="[programId]"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="(episode)"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
