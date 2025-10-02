import { LegendList } from "@legendapp/list";
import ProgramItem from "./program-item";
import { RefetchOptions } from "@tanstack/react-query";
import { Button, FlatList, Text, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { Program } from "../types/types";
import { useLayout } from "../context/layout-context";

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
  console.log("Props received by ProgramsList: ", { data });

  const { tabBarHeight } = useLayout();
  const { colors } = useAppTheme();

  const ListEmptyComponent = () => {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: colors.secondaryText }}>No Items</Text>
        <Button
          title="Refresh"
          color={colors.primary}
          onPress={() => {
            refetch({ cancelRefetch: false });
          }}
        />
      </View>
    );
  };

  return (
    <LegendList
      data={data}
      keyExtractor={(item) => item.Id}
      renderItem={({ item }) => <ProgramItem item={item} />}
      onRefresh={() => refetch({ cancelRefetch: false })}
      refreshing={isFetching && !isLoading}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 8,
        paddingTop: 8,
        paddingBottom: tabBarHeight,
      }}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
