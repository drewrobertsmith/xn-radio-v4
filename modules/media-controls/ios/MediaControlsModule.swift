import ExpoModulesCore
import MediaPlayer

public class MediaControlsModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('MediaControls')` in JavaScript.
    Name("MediaControls")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // --- MediaControls --- //

    Function("updateNowPlaying") { (trackInfo: [String: Any]) in
    // The Now Playing Info Center is a singleton that manages lock screen/control center info.
      var nowPlayingInfo = [String: Any]()

      // Use MPMediaItemProperty... for track metadata.
      if let title = trackInfo["title"] as? String {
        nowPlayingInfo[MPMediaItemPropertyTitle] = title
      }
      if let artist = trackInfo["artist"] as? String {
        nowPlayingInfo[MPMediaItemPropertyArtist] = artist
      }
      if let album = trackInfo["album"] as? String {
        nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = album
      }
      if let duration = trackInfo["duration"] as? Double {
        // Duration is also a media item property.
        nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
      }
      // Use MPNowPlayingInfoProperty... for playback state. This was correct.
      let isPlaying = trackInfo["isPlaying"] as? Bool ?? false
      nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = isPlaying ? 1.0 : 0.0
      nowPlayingInfo[MPNowPlayingInfoPropertyDefaultPlaybackRate] = 1.0

      // Set the info dictionary.
      MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo

      // --- ARTWORK HANDLING (CORRECTED KEY) ---
      if let artworkUrlString = trackInfo["artwork"] as? String, let artworkUrl = URL(string: artworkUrlString) {
        URLSession.shared.dataTask(with: artworkUrl) { (data, response, error) in
          guard let data = data, error == nil, let image = UIImage(data: data) else {
            return
          }
          let artwork = MPMediaItemArtwork(boundsSize: image.size) { _ in
            return image
          }
          DispatchQueue.main.async {
            // The key for artwork is an MPMediaItemProperty.
            MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPMediaItemPropertyArtwork] = artwork
          }
        }.resume()
      }
    }
    Function("hideNowPlaying") {
      // Setting the info to nil removes it from the control center.
      MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
    }
  }
}
