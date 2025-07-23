import { LegendList } from "@legendapp/list";
import ProgramItem from "./program-item";
import { Program } from "@/types/types";
import { RefetchOptions } from "@tanstack/react-query";

type ListProps = {
  data: Program[];
  isFetching: boolean;
  isLoading: boolean;
  refetch: (options: RefetchOptions) => void;
};

export default function ProgramsList({
  data,
  isFetching,
  isLoading,
  refetch,
}: ListProps) {
  return (
    <LegendList
      data={data}
      keyExtractor={(item) => item.Id}
      renderItem={({ item }) => <ProgramItem item={item} />}
      onRefresh={() => refetch({ cancelRefetch: false })}
      refreshing={isFetching && !isLoading}
      estimatedItemSize={162}
      recycleItems={true}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 8,
      }}
      style={{
        paddingTop: 8,
      }}
    />
  );
}
