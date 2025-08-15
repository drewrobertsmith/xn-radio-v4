import { audio$, Track } from "@/state/audio";
import { Clip } from "@/types/types";
import { formatDuration } from "@/utils/formatters";
import { use$ } from "@legendapp/state/react";
import { Text } from "react-native";

export function RenderClipDuration(item: Clip) {
  const effectiveProgressSec = use$(() => {
    const currentTrackId = audio$.currentTrack.id.get();
    const playbackState = audio$.playbackState.get();

    // Check if THIS ClipItem is the one that's currently loaded in the player.
    const isPlayingThisItem = currentTrackId === item.Id;

    // If this item is the one playing or paused, use the LIVE player time.
    // This will cause this specific ClipItem to re-render as the time updates.
    if (
      isPlayingThisItem &&
      (playbackState === "playing" || playbackState === "paused")
    ) {
      return audio$.status.currentTime.get();
    }

    // Otherwise, for all other items, just use the last saved progress.
    // This will not cause re-renders unless the saved progress changes.
    return audio$.progress[item.Id].get();
  });

  const progressSeconds = effectiveProgressSec || 0;
  if (progressSeconds > 1) {
    // Check for > 1 to avoid showing "1s left" for negligible progress
    const remaining = item.DurationSeconds - progressSeconds;
    // Ensure we don't show a negative duration if there's a slight delay
    if (remaining < 0) return null;
    return <Text>{formatDuration(remaining, "summary")} left</Text>;
  }
  return <Text>{formatDuration(item.DurationSeconds, "summary")}</Text>;
}

export function RenderTrackDuration(item: Track) {
  const effectiveProgressSec = use$(() => {
    const currentTrackId = audio$.currentTrack.id.get();
    const playbackState = audio$.playbackState.get();

    // Check if THIS ClipItem is the one that's currently loaded in the player.
    const isPlayingThisItem = currentTrackId === item.id;

    // If this item is the one playing or paused, use the LIVE player time.
    // This will cause this specific ClipItem to re-render as the time updates.
    if (
      isPlayingThisItem &&
      (playbackState === "playing" || playbackState === "paused")
    ) {
      return audio$.status.currentTime.get();
    }

    // Otherwise, for all other items, just use the last saved progress.
    // This will not cause re-renders unless the saved progress changes.
    return audio$.progress[item.id].get();
  });

  const progressSeconds = effectiveProgressSec || 0;
  if (progressSeconds > 1) {
    // Check for > 1 to avoid showing "1s left" for negligible progress
    const remaining = item?.duration - progressSeconds;
    // Ensure we don't show a negative duration if there's a slight delay
    if (remaining < 0) return null;
    return <Text>{formatDuration(remaining, "summary")} left</Text>;
  }
  return <Text>{formatDuration(item?.duration, "summary")}</Text>;
}
