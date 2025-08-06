import { useLayout } from "@/context/layout-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

const MINI_PLAYER_HEIGHT = 64;

export const usePlayerBottomSheet = () => {
  const { tabBarHeight } = useLayout();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const animatedIndex = useSharedValue(0);
  const largePlayerOpacity = useSharedValue(0);
  const smallPlayerOpacity = useSharedValue(1);

  const snapPoints = useMemo(() => [MINI_PLAYER_HEIGHT, "100%"], []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const onAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      const isExpanding = fromIndex === 0 && toIndex === 1;
      const isCollapsing = fromIndex === 1 && toIndex === 0;

      if (isExpanding) {
        largePlayerOpacity.value = withTiming(1, { duration: 300 });
        smallPlayerOpacity.value = withTiming(0, { duration: 100 });
      }

      if (isCollapsing) {
        largePlayerOpacity.value = withTiming(0, { duration: 100 });
        smallPlayerOpacity.value = withTiming(1, { duration: 300 });
      }
    },
    [largePlayerOpacity, smallPlayerOpacity],
  );

  return {
    bottomSheetRef,
    animatedIndex,
    largePlayerOpacity,
    smallPlayerOpacity,
    snapPoints,
    expand,
    collapse,
    onAnimate,
    tabBarHeight,
  };
};