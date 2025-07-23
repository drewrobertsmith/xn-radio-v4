import { Stack } from "expo-router";

export default function PodcastLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[programId]" />
      <Stack.Screen name="(episode)" />
    </Stack>
  );
}
