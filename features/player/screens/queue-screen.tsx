import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useAppTheme } from "@/components/ui/theme-provider";
import Separator from "@/components/ui/separator";
import { Text, View } from "react-native";
import QueueHeaderItem from "@/components/queue-header-item";
import QueueItem from "@/components/queue-item";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";

const ListEmptyComponent = () => {
  const { colors } = useAppTheme();
  return (
    <View className="justify-center items-center flex-1">
      <Text style={{ color: colors.secondaryText }}>Add some episodes!</Text>
    </View>
  );
};

export default function QueueScreen() {
  const { colors } = useAppTheme();
  const queue = use$(() => audio$.queue.get());

  return (
    <BottomSheetFlatList
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors.card,
        paddingTop: 16,
        gap: 8,
      }}
      data={queue.tracks.slice(1)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <QueueItem item={item} />}
      ListHeaderComponent={QueueHeaderItem}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
