import { Alert, Dimensions } from "react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import RenderHTML from "react-native-render-html";
import { useAppTheme } from "./ui/theme-provider";
import { Track } from "@/state/audio";
import { router } from "expo-router";

export default function DescriptionHTML({
  description,
}: {
  description: Track["descriptionHTML"];
}) {
  const { width } = Dimensions.get("window");
  const { colors } = useAppTheme();

  if (!description) return;

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: description }}
      systemFonts={Constants.systemFonts}
      baseStyle={{
        fontSize: 16,
      }}
      tagsStyles={{
        a: {
          color: colors.primary,
          textDecorationLine: "underline",
        },
        p: {
          color: colors.text,
          marginBottom: 16,
          lineHeight: 24,
        },
      }}
      defaultTextProps={{
        selectable: true,
        selectionColor: colors.primary,
      }}
      renderersProps={{
        a: {
          onPress: async (event, url) => {
            // Handle internal app links (relative paths)
            if (url.startsWith("/")) {
              router.push(url as any);
              return;
            }

            // Handle all other links (mailto, tel, http, etc.)
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
              }
            } catch (error) {
              console.error("Failed to open URL:", error);
              Alert.alert("Error", "Could not open the link.");
            }
          },
        },
      }}
    />
  );
}
