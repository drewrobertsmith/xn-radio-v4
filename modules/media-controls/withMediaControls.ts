import {
  ConfigPlugin,
  withAndroidManifest,
  createRunOncePlugin,
  AndroidConfig,
} from "@expo/config-plugins";
import { ExpoConfig } from "@expo/config-types";

// This is the name of our plugin. It's used for caching.
const pkg = require("./package.json");
const PLUGIN_NAME = pkg.name;

// Define the type for our service tag, using the correct StringBoolean type.
type ManifestService = {
  $: {
    "android:name": string;
    "android:foregroundServiceType": string;
    "android:exported": string;
  };
  "intent-filter": {
    action: {
      $: {
        "android:name": string;
      };
    }[];
  }[];
};

/**
 * A config plugin to add the necessary permissions and service to AndroidManifest.xml
 * for background media playback notifications.
 */

const withMediaControls: ConfigPlugin = (config: ExpoConfig) => {
  return config;
};

// Use createRunOncePlugin to ensure the plugin is only run once.
export default createRunOncePlugin(withMediaControls, PLUGIN_NAME, pkg.version);
