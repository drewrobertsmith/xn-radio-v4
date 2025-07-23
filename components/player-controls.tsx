import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

export default function PlayerControls() {
  return (
    <View className="flex-1">
      <MaterialIcons name="replay" size={24} color="black" />
      <MaterialIcons name="play-circle-filled" size={24} color="black" />
      <MaterialIcons
        name="replay"
        size={24}
        color="black"
        style={{
          transform: [{ rotateX: "180deg" }],
        }}
      />
    </View>
  );
}
