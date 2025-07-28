// index.ts
// Reexport the native module. On web, it will be resolved to MediaControlsModule.web.ts

import MediaControlsModule from "./src/MediaControlsModule";

// and on native platforms to MediaControlsModule.ts
export { default } from "./src/MediaControlsModule";
export { default as MediaControlsView } from "./src/MediaControlsView";

export function hello(): string {
  return MediaControlsModule.hello();
}

/**
 * Updates the media controls in the notification shade (Android) or
 * control center (iOS) with the provided track information.
 */
export function updateNowPlaying(trackInfo) {
  return MediaControlsModule.updateNowPlaying(trackInfo);
}

/**
 * Hides and clears the media controls from the notification shade and
 * control center.
 */
export function hideNowPlaying() {
  return MediaControlsModule.hideNowPlaying();
}
