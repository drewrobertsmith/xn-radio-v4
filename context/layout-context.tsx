import React, { createContext, useContext, useMemo, useState } from "react";
import { View } from "react-native";

interface LayoutContextType {
  tabBarHeight: number;
  setTabBarHeight: (height: number) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabBarHeight, setTabBarHeight] = useState(0);

  // In LayoutProvider, the value object { tabBarHeight, setTabBarHeight } is recreated on every single render. If any component consuming this context re-renders, the provider itself re-renders, creating a new value object. This can cause all consumers of the context to re-render, even if the data they care about hasn't changed

  const value = useMemo(
    () => ({
      tabBarHeight,
      setTabBarHeight,
    }),
    [tabBarHeight], // Only recreate the object if tabBarHeight changes
  );

  return (
    <LayoutContext.Provider value={value}>
      {/* This View with flex: 1 is crucial to prevent layout collapse */}
      <View style={{ flex: 1 }}>{children}</View>
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
