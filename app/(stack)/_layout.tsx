import { Stack } from "expo-router";

export default function PodcastLayout() {
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
      <Stack.Screen name="(episode)" options={{ title: "" }} />
    </Stack>
  );
}
