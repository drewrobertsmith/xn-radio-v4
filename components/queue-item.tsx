import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "./ui/theme-provider";
import { formatDate } from "@/utils/formatters";
import { Image } from "expo-image";
import { useAudio } from "@/context/audio-context";
import { RenderTrackDuration } from "./duration";
import TrackPlayer, { Track } from "react-native-track-player";

export default function QueueItem({ item }: { item: Track }) {
  const { colors } = useAppTheme();
  const { play, removeFromQueue } = useAudio();

  const handleQueueItemPress = (item: Track) => {
    // const playerQueue = await TrackPlayer.getQueue();
    // const index = playerQueue.findIndex((track) => track.id === item.id);
    // if (index > -1) {
    //   await TrackPlayer.skip(index);
    play(item);
    // }
  };

  const handleLongPress = (item: Track) => {
    removeFromQueue(item.id);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleQueueItemPress(item);
      }}
      onLongPress={() => {
        handleLongPress(item);
      }}
    >
      <View className="flex-row justify-between items-center p-2 gap-2 ">
        <Image
          source={item.artwork}
          contentFit="contain"
          style={{
            aspectRatio: 1,
            height: 68,
            width: 68,
            borderRadius: 8,
          }}
        />
        <View className="flex-1">
          {!item.date ? null : (
            <Text className="text-xs" style={{ color: colors.secondaryText }}>
              {formatDate(item.date)}
            </Text>
          )}
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.text }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text className="text-xs" style={{ color: colors.secondaryText }}>
            {!item.duration ? (
              <Text className="font-semibold" style={{ color: colors.error }}>
                ON AIR
              </Text>
            ) : (
              <RenderTrackDuration track={item} />
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
