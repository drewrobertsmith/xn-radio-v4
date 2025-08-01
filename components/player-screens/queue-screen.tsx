import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useAppTheme } from "../ui/theme-provider";
import Separator from "../ui/separator";
import { Text, View } from "react-native";
import QueueHeaderItem from "../queue-header-item";
import QueueItem from "../queue-item";
import { useSelector } from "@legendapp/state/react";
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
  const queue = useSelector(audio$.queue);

  return (
    <BottomSheetFlatList
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors.card,
        paddingTop: 16,
        gap: 8,
      }}
      data={queue}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <QueueItem item={item} />}
      ListHeaderComponent={QueueHeaderItem}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
