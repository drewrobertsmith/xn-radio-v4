import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { ActivityIndicator, Text, View } from "react-native";
import { Image } from "expo-image";
import { useAppTheme } from "../components/ui/theme-provider";
import SignIn from "../components/sign-in";
import SignOut from "../components/sign-out";
import { api } from "../convex/_generated/api";

export default function Profile() {
  const { colors } = useAppTheme();
  const user = useQuery(api.users.currentUser);

  return (
    <View className="flex-1 items-center justify-center">
      <AuthLoading>
        <ActivityIndicator size="small" />
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Image
          source={user?.image}
          contentFit="cover"
          style={{
            width: 50,
            height: 50,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
        <Text style={{ color: colors.text }}>Hello, {user?.name}</Text>
        <Text style={{ color: colors.text }}>You are logged in!</Text>
        <SignOut />
      </Authenticated>
    </View>
  );
}
