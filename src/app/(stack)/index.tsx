import ProgramsList from "@/src/components/programs-list";
import { useAppTheme } from "@/src/components/ui/theme-provider";
import { usePodcasts } from "@/src/hooks/usePodcasts";
import { ActivityIndicator, Button, Text, View } from "react-native";

export default function Podcasts() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    usePodcasts();
  const { colors } = useAppTheme();

  console.log("usePodcasts hook state: ", {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  });

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
          color={colors.primary}
        />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.secondaryText }}>No Items Found</Text>
        <Button
          title="Refresh"
          onPress={() => refetch()}
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
