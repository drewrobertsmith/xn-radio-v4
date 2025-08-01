import { Clip } from "@/types/types";
import { useMemo } from "react";

/**
 * Formats a duration of time (in seconds) based on the specified type.
 *
 * @param durationSeconds The total duration in seconds.
 * @param numberType The formatting style to apply.
 *                   - 'summary': A brief, human-readable format (e.g., "41m", "56m").
 *                   - 'precise': A padded format (e.g., "1:01:01" or "41:22").
 *                   - 'playerCurrent': Same as 'precise'.
 */
export function formatDuration(
  durationSeconds: number,
  numberType: "precise" | "summary" | "playerCurrent",
): string {
  // 1. Ensure we have a valid, non-negative integer for seconds.
  const totalSeconds = Math.floor(durationSeconds);

  if (isNaN(totalSeconds) || totalSeconds < 0) {
    if (numberType === "summary") {
      // For summary, a short podcast might be 0s, but let's be more descriptive.
      // You might want "0m" or "0s" depending on context. "0m" is often clearer.
      return "0m";
    }
    return "00:00";
  }

  // 2. Calculate hours, minutes, and the remaining seconds.
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 3. Apply formatting based on the numberType.
  switch (numberType) {
    case "summary": {
      // For the summary view, we only show the most significant unit.
      if (hours > 0) {
        return `${hours}h`;
      }
      if (minutes > 0) {
        return `${minutes}m`;
      }
      // Only show seconds if the total duration is less than a minute.
      return `${seconds}s`;
    }

    case "precise":
    case "playerCurrent": {
      const pad = (num: number) => String(num).padStart(2, "0");

      if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
      } else {
        // For durations less than an hour, show MM:SS.
        return `${pad(minutes)}:${pad(seconds)}`;
      }
    }

    default:
      return "";
  }
}

//formats the date
export function formatDate(publishedUtc: Clip["PublishedUtc"]) {
  const date = new Date(publishedUtc);
  const options = { month: "long", day: "numeric" };
  const currentYear = new Date().getFullYear();

  if (date.getFullYear() === currentYear) {
    return date.toLocaleDateString("en-US", options);
  } else {
    return date.toLocaleDateString("en-US", { ...options, year: "numeric" });
  }
}

// //formats that season and episode
// export function formatSeasonAndEpisode(
//   seasonNumber: Clip["Season"],
//   episodeNumber: Clip["Episode"]
// ) {
//   return seasonNumber && episodeNumber
//     ? `S${seasonNumber} E${episodeNumber} - `
//     : "";
// }
//
// export function formatEpisodeType(episodeType: Clip["EpisodeType"]) {
//   return episodeType && episodeType === "Trailer" ? "Trailer - " : null;
// }

/**
 * A custom hook to get perfectly synchronized and memoized time strings
 * for a media player UI.
 *
 * @param currentTime The current playback time in seconds (can be a float).
 * @param duration The total duration of the media in seconds.
 * @returns An object with formatted strings for the current and remaining time.
 */
export function useSynchronizedDurations(
  currentTime: number,
  duration: number,
) {
  // 1. Extract the "complex expressions" into simple variables.
  // These are calculated on every render.
  const flooredCurrentTime = Math.floor(currentTime);
  const flooredDuration = Math.floor(duration);

  // 2. Use these simple variables as dependencies for useMemo.
  const synchronizedTimes = useMemo(() => {
    // This expensive formatting logic now ONLY runs when the integer
    // values of the time change, not on every render.
    const remainingTime = flooredDuration - flooredCurrentTime;

    return {
      formattedCurrentTime: formatDuration(flooredCurrentTime, "precise"),
      formattedRemainingTime: formatDuration(remainingTime, "precise"),
    };
  }, [flooredCurrentTime, flooredDuration]); // <-- Linter is now happy!

  return synchronizedTimes;
}