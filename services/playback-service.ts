import { audio$ } from "@/state/audio";
import * as TaskManager from "expo-task-manager";

export const AUDIO_TASK = "audio-task";

console.log("Defining the audio task...");

TaskManager.defineTask(AUDIO_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Task Manager Error:", error);
    return;
  }

  if (data) {
    // `eventName` is the key from the native media controls
    const { eventName } = data as { eventName: string };
    console.log("Background Task: Received native event: ", eventName);

    switch (eventName) {
      case "play":
        audio$.playbackState.set("playing");
        break;
      case "pause":
        audio$.playbackState.set("paused");
        break;
      case "next":
        audio$.playNextTrack();
        break;
      case "previous":
        audio$.playPreviousTrack();
        break;
      // You can also handle other events like 'seek' if needed
    }
  }
});

console.log("Audio task defined");
