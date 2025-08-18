import Animated, { useAnimatedProps } from "react-native-reanimated";
import { useAppTheme } from "./theme-provider";
import { Platform, StyleSheet, TextInput } from "react-native";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedText({ animatedValue, initalValue, style }) {
  const { colors } = useAppTheme();

  const animatedProps = useAnimatedProps(() => {
    return {
      text: animatedValue.value,
    };
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={initalValue} // Set initial value
      style={[
        styles.text,
        {
          color: colors.secondaryText,
        },
        style,
      ]}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    // Add any other default text styles here
  },
});
