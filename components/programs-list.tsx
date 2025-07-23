import { LegendList } from "@legendapp/list";
import ProgramItem from "./program-item";
import { Program } from "@/types/types";
import { RefetchOptions } from "@tanstack/react-query";
import { useLayout } from "@/context/layout-context";

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
  const { tabBarHeight } = useLayout();

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
        paddingTop: 8,
        paddingBottom: tabBarHeight,
      }}
    />
  );
}
