import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as RNTheme,
  useTheme as useRNTheme,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";

export interface XNTheme extends Theme {
  colors: Theme["colors"] & {
    secondary: string;
    secondaryText: string;
    error: string;
  };
}

const corePalette = {
  logoWhite: "#FFFFFF",
  citySilhouette: "#121013",
  duskSky: "#4A3F55",
  cloudGray: "#6C707C",
  sunsetGlow: "#B98B85",
  windowLight: "#E8C57B",
};

const colors = {
  light: {
    background: "#F2F2F7", // Soft light gray for main background
    card: "#FFFFFF", // White for elevated surfaces like cards
    text: "#121013", // Near-black for primary text
    secondaryText: "#6C707C", // Muted gray for subtitles
    primary: "#B98B85", // Main brand accent for buttons, links
    secondary: "#4A3F55", // Secondary accent for highlights
    border: "#DCDCDC", // Subtle border color
    error: "#C75D5D",
  },
  dark: {
    background: "#121013", // Rich off-black for main background
    card: "#1C1C1E", // Lighter gray for elevated surfaces
    text: "#F5F5F5", // Off-white for primary text
    secondaryText: "#8E8E93", // Muted gray for subtitles
    primary: "#B98B85", // Main brand accent, pops on dark
    secondary: "#E8C57B", // Warm yellow for icons, highlights
    border: "#2D2B30", // Subtle border color
    error: "#E57373",
  },
};

export const XNDefaultTheme: XNTheme = {
  dark: false,
  colors: {
    primary: colors.light.primary,
    secondary: colors.light.secondary,
    background: colors.light.background,
    card: colors.light.card,
    text: colors.light.text,
    secondaryText: colors.light.secondaryText,
    border: colors.light.border,
    notification: colors.light.secondary,
    error: colors.light.error,
  },
  fonts: DefaultTheme.fonts,
};

export const XNDarkTheme: XNTheme = {
  dark: true,
  colors: {
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    background: colors.dark.background,
    card: colors.dark.card,
    text: colors.dark.text,
    secondaryText: colors.dark.secondaryText,
    border: colors.dark.border,
    notification: colors.dark.secondary,
    error: colors.dark.error,
  },
  fonts: DarkTheme.fonts,
};

//useAppTheme hook for less typing of the extended theme to access secondary properties
export const useAppTheme = () => useRNTheme() as XNTheme;

export default function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? XNDarkTheme : XNDefaultTheme}>
      {props.children}
    </RNTheme>
  );
}
