import { usePodcasts } from "@/hooks/usePodcasts";
import { ActivityIndicator, Text, View } from "react-native";
import ProgramsList from "@/components/programs-list";

export default function Podcasts() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    usePodcasts();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View className="flex-1 p-8">
      <ProgramsList
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        refetch={refetch}
      />
    </View>
  );
}
