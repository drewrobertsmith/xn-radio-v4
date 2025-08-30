import { audio$ } from "@/state/audio";
import { Clip } from "@/types/types";
import { formatDuration } from "@/utils/formatters";
import { observer, use$ } from "@legendapp/state/react";
import { Text } from "react-native";
import { State, Track } from "react-native-track-player";

type RenderRemainingDurationProps = {
  id: string;
  duration: number;
};

export const RenderRemainingDuration = observer(
  function RenderRemainingDuration({
    id,
    duration,
  }: RenderRemainingDurationProps) {
    // This hook now intelligently selects which progress to display.
    const effectivePosition = use$(() => {
      const playerState = audio$.playerState.get();
      const currentTrackId = audio$.currentTrack.id.get();

      const isThisItemActive =
        currentTrackId === id &&
        (playerState === State.Playing || playerState === State.Paused);

      // If this item is the one playing/paused, use the LIVE player position.
      if (isThisItemActive) {
        return audio$.progress.position.get();
      }

      // --- THIS IS THE NEW LOGIC ---
      // Otherwise, for all other items, look up its saved progress in our map.
      // .get() will return undefined if the key doesn't exist, which is fine.
      return audio$.savedProgress[id].get();
    });

    // Use the calculated position, defaulting to 0 if it's null or undefined.
    const position = effectivePosition || 0;

    if (!duration || duration <= 0) {
      return null;
    }

    if (position > 1) {
      const remaining = duration - position;
      if (remaining < 0) return null;
      return <Text>{formatDuration(remaining, "summary")} left</Text>;
    }

    return <Text>{formatDuration(duration, "summary")}</Text>;
  },
);
export function RenderClipDuration({ item }: { item: Clip }) {
  return (
    <RenderRemainingDuration id={item.Id} duration={item.DurationSeconds} />
  );
}

export function RenderTrackDuration({ track }: { track: Track }) {
  // Ensure track.duration is a valid number before passing it
  const duration = typeof track?.duration === "number" ? track.duration : 0;
  return <RenderRemainingDuration id={track.id} duration={duration} />;
}
