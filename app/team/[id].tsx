import { router, Stack, useLocalSearchParams } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import {
  MATCHES,
  STANDINGS,
  getTeam,
} from "@/constants/worldcup";
import { MatchCard } from "@/components/MatchCard";
import { useFavorites } from "@/providers/favorites-provider";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = getTeam(id ?? "");
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(team.id);

  const standing = STANDINGS[team.group]?.find((s) => s.teamId === team.id);
  const teamMatches = MATCHES.filter(
    (m) => m.homeId === team.id || m.awayId === team.id
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: team.short,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggle(team.id)}
              hitSlop={12}
              style={{ paddingHorizontal: 8 }}
            >
              <Heart
                size={22}
                color={fav ? Colors.palette.crimson : Colors.palette.textMuted}
                fill={fav ? Colors.palette.crimson : "transparent"}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroFlag}>{team.flag}</Text>
          <Text style={styles.heroName}>{team.name}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>Group {team.group}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>FIFA #{team.rank}</Text>
            </View>
          </View>
        </View>

        {standing ? (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Tournament Stats</Text>
            <View style={styles.statsRow}>
              <StatBox label="Played" value={standing.played} />
              <StatBox label="Won" value={standing.won} accent={Colors.palette.electric} />
              <StatBox label="Drawn" value={standing.drawn} />
              <StatBox label="Lost" value={standing.lost} accent={Colors.palette.crimson} />
            </View>
            <View style={styles.divider} />
            <View style={styles.statsRow}>
              <StatBox label="Goals For" value={standing.gf} />
              <StatBox label="Goals Against" value={standing.ga} />
              <StatBox
                label="Goal Diff"
                value={standing.gf - standing.ga}
                accent={
                  standing.gf - standing.ga > 0
                    ? Colors.palette.electric
                    : Colors.palette.crimson
                }
              />
              <StatBox label="Points" value={standing.points} accent={Colors.palette.gold} />
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matches</Text>
        </View>
        {teamMatches.length === 0 ? (
          <Text style={styles.emptyText}>No matches scheduled.</Text>
        ) : (
          teamMatches.map((m) => <MatchCard key={m.id} match={m} />)
        )}

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.backBtnText}>Back to teams</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, accent ? { color: accent } : null]}>
        {value > 0 && label === "Goal Diff" ? `+${value}` : value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.palette.ink },
  content: { paddingBottom: 32 },
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: Colors.palette.pitch,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.18)",
  },
  heroFlag: { fontSize: 72, marginBottom: 8 },
  heroName: {
    color: Colors.palette.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroMeta: { flexDirection: "row", gap: 8 },
  metaPill: {
    backgroundColor: "rgba(255, 200, 87, 0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metaPillText: {
    color: Colors.palette.gold,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statsCard: {
    margin: 16,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    borderRadius: 18,
    padding: 16,
  },
  statsTitle: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: {
    color: Colors.palette.text,
    fontSize: 22,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    color: Colors.palette.textDim,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.palette.border,
    marginVertical: 14,
  },
  section: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  sectionTitle: {
    color: Colors.palette.text,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  emptyText: {
    color: Colors.palette.textDim,
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 24,
  },
  backBtn: {
    margin: 16,
    paddingVertical: 14,
    backgroundColor: Colors.palette.surface,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.palette.border,
  },
  backBtnText: {
    color: Colors.palette.gold,
    fontWeight: "800",
    fontSize: 14,
  },
});
