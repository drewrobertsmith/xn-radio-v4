import { LegendList } from "@legendapp/list";
import { View } from "react-native";
import ClipItem from "./clip-item";
import Separator from "./ui/separator";
import { Clip } from "@/types/types";
import { RefetchOptions } from "@tanstack/react-query";

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
  return (
    <View className="flex-1">
      <LegendList
        data={data}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => <ClipItem item={item} />}
        refreshing={isFetching && !isLoading}
        onRefresh={() => refetch({ cancelRefetch: false })}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 8,
          marginVertical: 8,
          paddingBottom: 16,
        }}
        ItemSeparatorComponent={Separator}
        recycleItems={true}
      />
    </View>
  );
}
