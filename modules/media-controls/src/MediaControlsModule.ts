//MediaControlsModule.ts

import { NativeModule, requireNativeModule } from "expo";
import { MediaControlsModuleEvents } from "./MediaControls.types";

declare class MediaControlsModule extends NativeModule<MediaControlsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  updateNowPlaying(trackInfo): void;
  hideNowPlaying(): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MediaControlsModule>("MediaControls");
