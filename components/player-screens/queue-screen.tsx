import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useAppTheme } from "../ui/theme-provider";
import Separator from "../ui/separator";
import { Button, Text, TouchableOpacity, View } from "react-native";
import QueueHeaderItem from "../queue-header-item";
import QueueItem from "../queue-item";
import { use$ } from "@legendapp/state/react";
import { audio$ } from "@/state/audio";
import { useAudio } from "@/context/audio-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
  const { clearQueue } = useAudio();
  const { bottom } = useSafeAreaInsets();

  const queue = use$(audio$.queue.tracks); //subscribe to queue updates
  const current = use$(audio$.currentTrack);

  return (
    <View className="flex-1">
      <BottomSheetFlatList
        contentContainerStyle={{
          flex: 1,
          backgroundColor: colors.card,
          paddingTop: 16,
          gap: 8,
        }}
        // data={queue.filter((track) => track.id !== current?.id)}
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <QueueItem item={item} />}
        ListHeaderComponent={QueueHeaderItem}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={ListEmptyComponent}
      />
      <TouchableOpacity
        className="h-[15%] items-center justify-center flex-row  gap-2 "
        style={{ marginBottom: bottom, backgroundColor: colors.card }}
        onPress={() => {
          clearQueue();
        }}
      >
        <Text className="text-lg" style={{ color: colors.text }}>
          Clear Queue
        </Text>
        <MaterialIcons
          name="playlist-remove"
          size={32}
          color={colors.text}
          title="Clear Queue"
        />
      </TouchableOpacity>
    </View>
  );
}
