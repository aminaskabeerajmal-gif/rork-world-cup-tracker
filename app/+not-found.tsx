import { Link, Stack } from "expo-router";
import { Compass } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Off the Pitch" }} />
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Compass size={36} color={Colors.palette.gold} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Lost the ball</Text>
        <Text style={styles.subtitle}>
          This screen has been substituted off the pitch.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to matches</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.palette.ink,
    gap: 12,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    color: Colors.palette.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.palette.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: Colors.palette.gold,
    borderRadius: 12,
  },
  linkText: {
    color: Colors.palette.ink,
    fontWeight: "800",
    fontSize: 14,
  },
});
