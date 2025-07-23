// src/hooks/useDevActions.ts
import { useEffect } from "react";
import { DevSettings } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { mmkv } from "@/utils/mmkv-storage";

export const useDevActions = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem("Clear All Caches", () => {
        console.log("Clearing all caches...");

        // 1. Clear TanStack Query's in-memory cache
        queryClient.clear();

        // 2. Clear the MMKV persisted cache
        mmkv.clearAll();

        console.log("Caches cleared! Please reload the app.");
        // Optional: Force a reload of the app
        DevSettings.reload();
      });
    }
  }, [queryClient]);
};
