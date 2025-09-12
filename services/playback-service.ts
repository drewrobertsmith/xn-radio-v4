import { audio$ } from "@/state/audio";
import TrackPlayer, { Event, State } from "react-native-track-player";

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlayPause, () => {
    console.log("Event.RemotePlayPause");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("Event.RemotePause");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("Event.RemotePlay");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log("Event.RemoteNext");
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log("Event.RemotePrevious");
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    console.log("Event.RemoteJumpForward", event);
    TrackPlayer.seekBy(event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    console.log("Event.RemoteJumpBackward", event);
    TrackPlayer.seekBy(-event.interval);
  });

  // TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
  //   console.log("Event.RemoteSeek", event);
  //   TrackPlayer.seekTo(event.position);
  // });

  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    console.log("Event.RemoteDuck", event);
  });

  // State Management Events

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    console.log("Event.PlaybackActiveTrackChanged", event);
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
    console.log("Event.PlaybackProgressUpdated", event);
    audio$.progress.set({
      position: event.position ?? 0,
      duration: event.duration ?? 0,
      buffered: event.buffered ?? 0,
    });
  });

  TrackPlayer.addEventListener(Event.PlaybackPlayWhenReadyChanged, (event) => {
    console.log("Event.PlaybackPlayWhenReadyChanged", event);
  });

  TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
    console.log("Event.PlaybackState", state);
    audio$.playerState.set(state);
  });

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
    console.log("Event.PlaybackQueueEnded", event);
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    console.error("Event.PlaybackError", event);
    // Update Legend State with the error message
    audio$.error.set(event.message);
    // reset other states here
    audio$.playerState.set(State.Error);
  });

  TrackPlayer.addEventListener(Event.MetadataChapterReceived, (event) => {
    console.log("Event.MetadataChapterReceived", event);
  });

  TrackPlayer.addEventListener(Event.MetadataTimedReceived, (event) => {
    console.log("Event.MetadataTimedReceived", event);
  });

  TrackPlayer.addEventListener(Event.MetadataCommonReceived, (event) => {
    console.log("Event.MetadataCommonReceived", event);
  });
}
