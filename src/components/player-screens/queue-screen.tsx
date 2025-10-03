import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useAppTheme } from "../ui/theme-provider";
import Separator from "../ui/separator";
import { Button, Text, View } from "react-native";
import QueueHeaderItem from "../queue-header-item";
import QueueItem from "../queue-item";
import { Track, useActiveTrack } from "react-native-track-player";

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
  // TODO: Add to async audio controller
  // const queue = use$(audio$.queue.tracks); //subscribe to queue updates
  const queue: Track[] = [];
  const current = useActiveTrack();

  return (
    <View className="flex-1">
      <Button
        onPress={() => {
          // clearQueue();
        }}
        title="Clear Queue"
      />
      <BottomSheetFlatList
        contentContainerStyle={{
          flex: 1,
          backgroundColor: colors.card,
          paddingTop: 16,
          gap: 8,
        }}
        data={queue.filter((track) => track.id !== current?.id)}
        keyExtractor={(item: Track) => item.id}
        renderItem={({ item }: { item: Track }) => <QueueItem item={item} />}
        ListHeaderComponent={QueueHeaderItem}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}
