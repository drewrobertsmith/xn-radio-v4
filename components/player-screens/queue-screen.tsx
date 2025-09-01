import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useAppTheme } from "../ui/theme-provider";
import Separator from "../ui/separator";
import { Text, View } from "react-native";
import QueueHeaderItem from "../queue-header-item";
import QueueItem from "../queue-item";
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

  const upNext = use$(() => {
    const queue = audio$.queue.tracks.get();
    const current = audio$.currentTrack.get();

    // If there's no current track, show the whole queue.
    if (!current) {
      return queue;
    }

    // Otherwise, show all tracks that are NOT the current one.
    return queue.filter((track) => track.id !== current.id);
  });

  return (
    <BottomSheetFlatList
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors.card,
        paddingTop: 16,
        gap: 8,
      }}
      data={upNext}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <QueueItem item={item} />}
      ListHeaderComponent={QueueHeaderItem}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
