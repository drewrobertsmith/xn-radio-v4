import { usePodcasts } from "@/hooks/usePodcasts";
import { ActivityIndicator, Button, Text, View } from "react-native";
import ProgramsList from "@/components/programs-list";
import { useAppTheme } from "@/components/ui/theme-provider";

export default function Podcasts() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    usePodcasts();
  const { colors } = useAppTheme();

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.error }}>Error: {error.message}</Text>
        <Button
          title="Refresh"
          onPress={() => {
            refetch();
          }}
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 px-2">
      <ProgramsList
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        refetch={refetch}
      />
    </View>
  );
}
