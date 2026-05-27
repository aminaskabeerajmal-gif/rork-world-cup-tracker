import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, usePathname } from "expo-router";
import { CalendarDays, Trophy, Users, Goal } from "lucide-react-native";

import Colors from "@/constants/colors";

type TabKey = "index" | "standings" | "teams" | "scorers";

const TABS: { key: TabKey; label: string; icon: typeof CalendarDays }[] = [
  { key: "index", label: "Matches", icon: CalendarDays },
  { key: "standings", label: "Standings", icon: Trophy },
  { key: "teams", label: "Teams", icon: Users },
  { key: "scorers", label: "Scorers", icon: Goal },
];

export default function TopTabBar() {
  const pathname = usePathname();
  const activeKey: TabKey = pathname.includes("/standings")
    ? "standings"
    : pathname.includes("/teams")
      ? "teams"
      : pathname.includes("/scorers")
        ? "scorers"
        : "index";

  const go = (key: TabKey) => {
    if (key === activeKey) return;
    const path = key === "index" ? "/" : `/${key}`;
    router.navigate(path as never);
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = key === activeKey;
          const color = active ? Colors.palette.ink : Colors.palette.text;
          return (
            <Pressable
              key={key}
              onPress={() => go(key)}
              style={[styles.chip, active && styles.chipActive]}
              testID={`top-tab-${key}`}
            >
              <Icon color={color} size={16} strokeWidth={2.5} />
              <Text style={[styles.label, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.palette.ink,
    borderBottomColor: Colors.palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
  },
  chipActive: {
    backgroundColor: Colors.palette.gold,
    borderColor: Colors.palette.gold,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
