import React, { useCallback } from "react";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LayoutChangeEvent, View } from "react-native";
import { useLayout } from "@/src/context/layout-context";

export const CustomTabBar = (props: BottomTabBarProps) => {
  const { tabBarHeight, setTabBarHeight } = useLayout();

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height > 0 && height !== tabBarHeight) {
        setTabBarHeight(height);
      }
    },
    [setTabBarHeight, tabBarHeight],
  );

  return (
    <View onLayout={handleLayout}>
      <BottomTabBar {...props} />
    </View>
  );
};
