import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";

export default function ModalScreen() {
  return (
    <Modal
      animationType="fade"
      transparent
      visible
      onRequestClose={() => router.back()}
    >
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>About this tracker</Text>
          <Text style={styles.body}>
            A live World Cup companion: real-time scores, group standings, team
            profiles, and the Golden Boot race.
          </Text>
          <TouchableOpacity
            testID="modal-close"
            style={styles.btn}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <X size={16} color={Colors.palette.ink} strokeWidth={2.5} />
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: Colors.palette.border,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.palette.border,
    marginBottom: 18,
  },
  title: {
    color: Colors.palette.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  body: {
    color: Colors.palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.palette.gold,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: { color: Colors.palette.ink, fontWeight: "800", fontSize: 15 },
});
