import { View } from "react-native";
import { useAppTheme } from "./theme-provider";

export default function Separator() {
  const { colors } = useAppTheme();
  return (
    <View
      className="border-hairline mt-2"
      style={{ borderColor: colors.border }}
    />
  );
}
