import ThemeProvider from "@/components/ui/theme-provider";
import "../global.css";
import { Tabs } from "expo-router";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { mmkvStorage } from "@/utils/mmkv-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LayoutProvider } from "@/context/layout-context";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useState } from "react";
import { Player } from "@/components/player";
import { PlayerAnimationProvider } from "@/context/player-animation-context";
import TrackPlayer from "react-native-track-player";
import { PlaybackService } from "@/services/playback-service";
import { SetupService } from "@/services/setup-track-player-service";
import { QueueInitialTracksService } from "@/services/queue-initial-track.service";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });

  const secureStorage = {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync,
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10, //10 min to align with omny's cache duration
        gcTime: Infinity,
      },
    },
  });

  const persister = createAsyncStoragePersister({
    storage: mmkvStorage,
    throttleTime: 1000,
  });

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <CustomTabBar {...props} />,
    [],
  );

  TrackPlayer.registerPlaybackService(() => PlaybackService);

  const isPlayerReady = useSetupPlayer();

  function useSetupPlayer() {
    const [playerReady, setPlayerReady] = useState<boolean>(false);

    useEffect(() => {
      let unmounted = false;
      (async () => {
        await SetupService();
        if (unmounted) return;
        setPlayerReady(true);
        const queue = await TrackPlayer.getQueue();
        if (unmounted) return;
        if (queue.length <= 0) {
          await QueueInitialTracksService();
        }
      })();
      return () => {
        unmounted = true;
      };
    }, []);
    return playerReady;
  }

  return (
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }} // Add an onMount callback to see when hydration is complete
        onSuccess={() => {
          console.log("TanStack Query cache restored from MMKV.");
        }}
      >
        <ThemeProvider>
          <LayoutProvider>
            <PlayerAnimationProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Tabs tabBar={renderTabBar}>
                  <Tabs.Screen
                    name="index"
                    options={{
                      title: "Radio",
                      tabBarIcon: ({ color }) => (
                        <MaterialIcons
                          name="cell-tower"
                          size={24}
                          color={color}
                        />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="(stack)"
                    options={{
                      headerShown: false,
                      title: "Podcasts",
                      tabBarIcon: ({ color }) => (
                        <MaterialIcons name="headset" size={24} color={color} />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="profile"
                    options={{
                      href: null, //hide route for now
                      title: "Profile",
                      tabBarIcon: ({ color }) => (
                        <MaterialIcons
                          name="tag-faces"
                          size={24}
                          color={color}
                        />
                      ),
                    }}
                  />
                </Tabs>
                <Player />
              </GestureHandlerRootView>
            </PlayerAnimationProvider>
          </LayoutProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </ConvexAuthProvider>
  );
}
