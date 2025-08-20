import ClipList from "@/components/clip-list";
import { useAppTheme } from "@/components/ui/theme-provider";
import { useClips } from "@/hooks/useClips";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Button, Text, View } from "react-native";

export default function ProgramPage() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useClips(programId);
  const { colors } = useAppTheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.error }}>Error: {error.message}</Text>
        <Button
          title="Refresh"
          onPress={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ClipList
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        refetch={refetch}
      />
    </View>
  );
}
