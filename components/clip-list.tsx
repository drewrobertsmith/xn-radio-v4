import { LegendList } from "@legendapp/list";
import ClipItem from "./clip-item";
import Separator from "./ui/separator";
import { Clip } from "@/types/types";
import { RefetchOptions } from "@tanstack/react-query";
import { useLayout } from "@/context/layout-context";

type ListProps = {
  data: Clip[];
  isFetching: boolean;
  isLoading: boolean;
  refetch: (options: RefetchOptions) => void;
};

export default function ClipList({
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
      renderItem={({ item }) => (
        <ClipItem item={item} isLoading={isLoading} isFetching={isFetching} />
      )}
      refreshing={isFetching && !isLoading}
      onRefresh={() => refetch({ cancelRefetch: false })}
      contentContainerStyle={{
        gap: 8,
        paddingHorizontal: 8,
        marginVertical: 8,
        paddingBottom: tabBarHeight,
      }}
      ItemSeparatorComponent={Separator}
      recycleItems={true}
    />
  );
}
