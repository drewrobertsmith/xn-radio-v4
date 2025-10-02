import { useMemo } from "react";

export function formatDuration(
  durationSeconds: number,
  numberType: "precise" | "summary",
): string {
  const totalSeconds = Math.floor(durationSeconds);

  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return numberType === "summary" ? "0m" : "00:00";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (numberType === "summary") {
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  const pad = (num: number) => String(num).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

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
