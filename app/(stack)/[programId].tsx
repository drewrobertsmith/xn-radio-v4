import ClipList from "@/components/clip-list";
import { useClips } from "@/hooks/useClips";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text } from "react-native";

export default function ProgramPage() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useClips(programId);

  if (isLoading) {
    return <ActivityIndicator size="small" />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <ClipList
      data={data}
      isFetching={isFetching}
      isLoading={isLoading}
      refetch={refetch}
    />
  );
}
