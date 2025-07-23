import { useAuthActions } from "@convex-dev/auth/react";
import { Button, View } from "react-native";

export default function SignOut() {
  const { signOut } = useAuthActions();

  return (
    <View>
      <Button onPress={signOut} title="Sign Out" />
    </View>
  );
}
