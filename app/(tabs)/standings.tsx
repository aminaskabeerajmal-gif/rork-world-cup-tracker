import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { getTeam } from "@/constants/worldcup";
import { useLiveData } from "@/providers/live-data-provider";

export default function StandingsScreen() {
  const { standings: STANDINGS } = useLiveData();
  const GROUPS = Object.keys(STANDINGS);
  const [selected, setSelected] = useState<string>(GROUPS[0] ?? "A");

  const standings = STANDINGS[selected] ?? [];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {GROUPS.map((g) => {
          const active = selected === g;
          return (
            <TouchableOpacity
              key={g}
              testID={`group-tab-${g}`}
              onPress={() => setSelected(g)}
              style={[styles.tab, active && styles.tabActive]}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                Group {g}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tableHeader}>
          <Text style={[styles.h, styles.hRank]}>#</Text>
          <Text style={[styles.h, styles.hTeam]}>Team</Text>
          <Text style={[styles.h, styles.hCell]}>P</Text>
          <Text style={[styles.h, styles.hCell]}>W</Text>
          <Text style={[styles.h, styles.hCell]}>D</Text>
          <Text style={[styles.h, styles.hCell]}>L</Text>
          <Text style={[styles.h, styles.hCell]}>GD</Text>
          <Text style={[styles.h, styles.hCellWide]}>PTS</Text>
        </View>

        {standings.map((s, i) => {
          const team = getTeam(s.teamId);
          const qualified = i < 2;
          const gd = s.gf - s.ga;
          return (
            <Pressable
              key={s.teamId}
              testID={`standing-${s.teamId}`}
              onPress={() => router.push(`/team/${s.teamId}`)}
              style={({ pressed }) => [
                styles.row,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.hRank}>
                <View
                  style={[
                    styles.posBar,
                    qualified ? styles.posBarQualified : styles.posBarOut,
                  ]}
                />
                <Text style={styles.posText}>{i + 1}</Text>
              </View>
              <View style={[styles.hTeam, styles.teamCell]}>
                <Text style={styles.teamFlag}>{team.flag}</Text>
                <Text style={styles.teamName} numberOfLines={1}>
                  {team.name}
                </Text>
              </View>
              <Text style={[styles.cell, styles.hCell]}>{s.played}</Text>
              <Text style={[styles.cell, styles.hCell]}>{s.won}</Text>
              <Text style={[styles.cell, styles.hCell]}>{s.drawn}</Text>
              <Text style={[styles.cell, styles.hCell]}>{s.lost}</Text>
              <Text
                style={[
                  styles.cell,
                  styles.hCell,
                  gd > 0 && { color: Colors.palette.electric },
                  gd < 0 && { color: Colors.palette.crimson },
                ]}
              >
                {gd > 0 ? `+${gd}` : gd}
              </Text>
              <Text style={[styles.cell, styles.hCellWide, styles.pts]}>
                {s.points}
              </Text>
            </Pressable>
          );
        })}

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.palette.electric }]}
            />
            <Text style={styles.legendText}>Qualified for Round of 16</Text>
          </View>
          <View style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.palette.textDim }]}
            />
            <Text style={styles.legendText}>Eliminated</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.palette.ink },
  tabs: { maxHeight: 56 },
  tabsContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
  },
  tabActive: {
    backgroundColor: Colors.palette.pitch,
    borderColor: Colors.palette.gold,
  },
  tabLabel: {
    color: Colors.palette.textMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  tabLabelActive: { color: Colors.palette.gold },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.palette.border,
  },
  h: {
    color: Colors.palette.textDim,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  hRank: { width: 36, flexDirection: "row", alignItems: "center", gap: 8 },
  hTeam: { flex: 1 },
  hCell: { width: 32, textAlign: "center" },
  hCellWide: { width: 44, textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.palette.border,
  },
  posBar: { width: 3, height: 22, borderRadius: 2 },
  posBarQualified: { backgroundColor: Colors.palette.electric },
  posBarOut: { backgroundColor: Colors.palette.textDim },
  posText: {
    color: Colors.palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  teamCell: { flexDirection: "row", alignItems: "center", gap: 10 },
  teamFlag: { fontSize: 22 },
  teamName: {
    color: Colors.palette.text,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  cell: {
    color: Colors.palette.textMuted,
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  pts: {
    color: Colors.palette.gold,
    fontWeight: "900",
    fontSize: 15,
  },
  legend: {
    marginTop: 18,
    gap: 8,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.palette.border,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: {
    color: Colors.palette.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
});
