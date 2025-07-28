package expo.modules.mediacontrols

import android.net.Uri
import android.widget.Toast // <-- NEW IMPORT FOR ON-SCREEN MESSAGES
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.launch
import java.net.URL

// This callback is still required by MediaSession, but we'll keep it minimal.
// It reports that we don't support any commands yet (like play/pause from the notification).
private class StubMediaSessionCallback : MediaSession.Callback {
    override fun onConnect(
        session: MediaSession,
        controller: MediaSession.ControllerInfo,
    ): MediaSession.ConnectionResult =
        MediaSession.ConnectionResult
            .AcceptedResultBuilder(session)
            .setAvailablePlayerCommands(Player.Commands.EMPTY)
            .build()
}

class MediaControlsModule : Module() {
    // These are our long-lived player and session objects.
    // They are initialized as null and will be created in OnCreate.
    private var player: Player? = null
    private var mediaSession: MediaSession? = null
    private val context
        get() = requireNotNull(appContext.reactContext)

    override fun definition() =
        ModuleDefinition {
            // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
            // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
            // The module will be accessible from `requireNativeModule('MediaControls')` in JavaScript.
            Name("MediaControls")

            // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
            Constants(
                "PI" to Math.PI,
            )

            // Defines event names that the module can send to JavaScript.
            Events("onChange")

            // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
            Function("hello") {
                "Hello world! 👋"
            }
            // Defines a JavaScript function that always returns a Promise and whose native code
            // is by default dispatched on the different thread than the JavaScript runtime runs on.
            AsyncFunction("setValueAsync") { value: String ->
                // Send an event to JavaScript.
                sendEvent(
                    "onChange",
                    mapOf(
                        "value" to value,
                    ),
                )
            }

            // OnCreate is called once when the module is first created.
            // This is the perfect place for one-time setup.
            OnCreate {
                player = ExoPlayer.Builder(context).build()
                mediaSession =
                    MediaSession
                        .Builder(context, player!!)
                        .setCallback(StubMediaSessionCallback())
                        .build()
            }

            // This function is now much simpler. It only updates the metadata.
            Function("updateNowPlaying") { trackInfo: Map<String, Any?> ->
                if (player == null) {
                    return@Function
                }

                // Dispatch the entire logic block to the main thread.
                appContext.mainQueue.launch {
                    // --- THE FIX: DEFINE ALL VARIABLES INSIDE THIS SCOPE ---
                    // By moving the definitions here, we avoid the closure problem.
                    val isPlaying = trackInfo["isPlaying"] as? Boolean ?: false
                    val title = trackInfo["title"] as? String
                    val artist = trackInfo["artist"] as? String
                    val album = trackInfo["album"] as? String
                    val artworkUrl = trackInfo["artwork"] as? String

                    val metadataBuilder =
                        MediaMetadata
                            .Builder()
                            .setTitle(title)
                            .setArtist(artist)
                            .setAlbumTitle(album)

                    if (artworkUrl != null) {
                        metadataBuilder.setArtworkUri(Uri.parse(artworkUrl))
                    }

                    val mediaItem =
                        MediaItem
                            .Builder()
                            .setMediaMetadata(metadataBuilder.build())
                            .build()

                    // Now, all these player calls will work because they are on the
                    // main thread and can see all the variables they need.
                    player?.setMediaItem(mediaItem)
                    player?.prepare()
                    player?.playWhenReady = isPlaying
                }
            }

            Function("hideNowPlaying") {
                appContext.mainQueue.launch {
                    player?.stop()
                    player?.clearMediaItems()
                }
            }

            OnDestroy {
                mediaSession?.release()
                player?.release()
            }
        }
}
