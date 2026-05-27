import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Goal, Sparkles, TrendingUp } from "lucide-react-native";

import Colors from "@/constants/colors";
import {
  GOLDEN_BOOT_CANDIDATES,
  GoldenBootCandidate,
  getTeam,
} from "@/constants/worldcup";
import { useLiveData } from "@/providers/live-data-provider";

type Slot = {
  candidate: GoldenBootCandidate;
  goals: number;
  assists: number;
  isLive: boolean;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

export default function ScorersScreen() {
  const { scorers, matches } = useLiveData();

  const slots: Slot[] = useMemo(() => {
    const liveTeams = new Set(
      matches.filter((m) => m.status === "live").flatMap((m) => [m.homeId, m.awayId])
    );
    const byName = new Map<string, { goals: number; assists: number }>();
    for (const s of scorers) {
      byName.set(`${s.teamId}:${normalize(s.name)}`, {
        goals: s.goals,
        assists: s.assists,
      });
    }
    const built: Slot[] = GOLDEN_BOOT_CANDIDATES.map((c) => {
      const live = byName.get(`${c.teamId}:${normalize(c.name)}`);
      return {
        candidate: c,
        goals: live?.goals ?? 0,
        assists: live?.assists ?? 0,
        isLive: liveTeams.has(c.teamId),
      };
    });
    built.sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return a.candidate.odds - b.candidate.odds;
    });
    return built;
  }, [scorers, matches]);

  const maxGoals = Math.max(1, ...slots.map((s) => s.goals));
  const totalGoals = slots.reduce((sum, s) => sum + s.goals, 0);
  const liveSlots = slots.filter((s) => s.isLive).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.iconBubble}>
          <Sparkles size={18} color={Colors.palette.gold} strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Golden Boot Race</Text>
          <Text style={styles.subtitle}>
            {GOLDEN_BOOT_CANDIDATES.length} contenders · live score slots
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatBubble label="GOALS" value={String(totalGoals)} accent={false} />
        <StatBubble label="LIVE NOW" value={String(liveSlots)} accent={liveSlots > 0} />
        <StatBubble label="PLAYERS" value={String(GOLDEN_BOOT_CANDIDATES.length)} accent={false} />
      </View>

      <View style={styles.list}>
        {slots.map((slot, i) => (
          <ScorerRow
            key={`${slot.candidate.teamId}-${slot.candidate.name}`}
            slot={slot}
            index={i}
            rank={i + 1}
            maxGoals={maxGoals}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function StatBubble({ label, value, accent }: { label: string; value: string; accent: boolean }) {
  return (
    <View style={[styles.stat, accent && styles.statAccent]}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ScorerRow({
  slot,
  index,
  rank,
  maxGoals,
}: {
  slot: Slot;
  index: number;
  rank: number;
  maxGoals: number;
}) {
  const team = getTeam(slot.candidate.teamId);
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const targetPct = slot.goals / maxGoals;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: targetPct,
      duration: 700,
      delay: Math.min(index, 12) * 40,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [targetPct, index, widthAnim]);

  useEffect(() => {
    if (!slot.isLive) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [slot.isLive, pulse]);

  const isLeader = rank === 1 && slot.goals > 0;
  const widthInterp = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  const dotOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

  return (
    <View style={[styles.row, isLeader && styles.rowLeader, slot.isLive && styles.rowLive]}>
      <View style={styles.rankWrap}>
        <Text style={[styles.rankText, isLeader && styles.rankTextLeader]}>{rank}</Text>
        <Text style={styles.shirtText}>#{slot.candidate.shirt}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.topLine}>
          <Text style={styles.flag}>{team.flag}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {slot.candidate.name}
          </Text>
          {isLeader ? (
            <View style={styles.crown}>
              <Text style={styles.crownText}>★</Text>
            </View>
          ) : null}
          {slot.isLive ? (
            <View style={styles.liveTag}>
              <Animated.View style={[styles.liveDot, { opacity: dotOpacity }]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {slot.candidate.position} · {slot.candidate.club}
        </Text>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              isLeader && styles.barFillLeader,
              slot.goals === 0 && styles.barFillEmpty,
              { width: widthInterp },
            ]}
          />
        </View>
        <View style={styles.footerLine}>
          <Text style={styles.assistText}>{slot.assists} assists</Text>
          <View style={styles.oddsWrap}>
            <TrendingUp size={10} color={Colors.palette.textDim} strokeWidth={2.5} />
            <Text style={styles.oddsText}>{slot.candidate.odds.toFixed(1)}x</Text>
          </View>
        </View>
      </View>
      <View style={styles.goalsWrap}>
        <View style={styles.goalsInner}>
          <Goal
            size={14}
            color={isLeader ? Colors.palette.gold : Colors.palette.textMuted}
            strokeWidth={2.5}
          />
          <Text style={[styles.goalsText, isLeader && styles.goalsTextLeader]}>
            {slot.goals}
          </Text>
        </View>
        <Text style={styles.goalsLabel}>GOALS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.palette.ink },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.palette.pitch,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.2)",
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 200, 87, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.palette.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: "rgba(244, 241, 232, 0.7)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  stat: {
    flex: 1,
    backgroundColor: Colors.palette.surface,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.palette.border,
  },
  statAccent: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.45)",
  },
  statValue: {
    color: Colors.palette.text,
    fontSize: 20,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  statValueAccent: { color: "#EF4444" },
  statLabel: {
    color: Colors.palette.textDim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 2,
  },
  list: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    borderRadius: 16,
    padding: 14,
  },
  rowLeader: {
    borderColor: Colors.palette.gold,
    backgroundColor: "#1F1B12",
  },
  rowLive: {
    borderColor: "rgba(239, 68, 68, 0.55)",
  },
  rankWrap: {
    width: 36,
    alignItems: "center",
  },
  rankText: {
    color: Colors.palette.textDim,
    fontSize: 18,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  rankTextLeader: { color: Colors.palette.gold },
  shirtText: {
    color: Colors.palette.textDim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  flag: { fontSize: 18 },
  name: {
    color: Colors.palette.text,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  meta: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 6,
  },
  crown: {
    backgroundColor: "rgba(255, 200, 87, 0.18)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  crownText: { color: Colors.palette.gold, fontSize: 11, fontWeight: "900" },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  liveText: {
    color: "#EF4444",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  barTrack: {
    height: 6,
    backgroundColor: Colors.palette.charcoal,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    height: "100%",
    backgroundColor: Colors.palette.electric,
    borderRadius: 3,
  },
  barFillLeader: { backgroundColor: Colors.palette.gold },
  barFillEmpty: { backgroundColor: "transparent" },
  footerLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assistText: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  oddsWrap: { flexDirection: "row", alignItems: "center", gap: 3 },
  oddsText: {
    color: Colors.palette.textDim,
    fontSize: 10,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  goalsWrap: { alignItems: "center", gap: 2, minWidth: 50 },
  goalsInner: { flexDirection: "row", alignItems: "center", gap: 5 },
  goalsText: {
    color: Colors.palette.text,
    fontSize: 22,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  goalsTextLeader: { color: Colors.palette.gold },
  goalsLabel: {
    color: Colors.palette.textDim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
