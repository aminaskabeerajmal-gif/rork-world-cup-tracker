import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RefreshCw } from "lucide-react-native";

import Colors from "@/constants/colors";
import { Match, TOURNAMENT } from "@/constants/worldcup";
import { MatchCard } from "@/components/MatchCard";
import { useLiveData } from "@/providers/live-data-provider";

type Filter = "all" | "live" | "upcoming" | "finished";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "finished", label: "Finished" },
];

const KICKOFF_MS = new Date("2026-06-11T20:00:00-04:00").getTime();

function useCountdown(targetMs: number) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (Date.now() >= targetMs) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function useRelativeTime(targetMs: number): string {
  const [, setTick] = useState<number>(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, Date.now() - targetMs);
  const s = Math.floor(diff / 1000);
  if (s < 1) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return `${m}m ${rs}s ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

export default function MatchesScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const { days, hours, minutes, seconds, done } = useCountdown(KICKOFF_MS);
  const { matches, liveCount, fetchedAt, isRefreshing, refresh } = useLiveData();
  const relUpdated = useRelativeTime(fetchedAt);

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const filtered = useMemo<Match[]>(() => {
    if (filter === "all") return matches;
    return matches.filter((m) => m.status === filter);
  }, [filter, matches]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      testID="matches-scroll"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={Colors.palette.gold}
          colors={[Colors.palette.gold]}
        />
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>FIFA WORLD CUP 2026</Text>
          </View>
          <Text style={styles.heroFlags}>{TOURNAMENT.hostFlags}</Text>
        </View>
        <Text style={styles.heroTitle}>We Are 26</Text>
        <Text style={styles.heroSub}>
          {liveCount > 0
            ? `${liveCount} match${liveCount > 1 ? "es" : ""} live across North America`
            : `${TOURNAMENT.startDate} – ${TOURNAMENT.endDate} · USA · CAN · MEX`}
        </Text>

        {done ? (
          <View style={styles.statRow}>
            <Stat value={String(TOURNAMENT.totalTeams)} label="Teams" />
            <View style={styles.statDivider} />
            <Stat value={String(TOURNAMENT.totalMatches)} label="Matches" />
            <View style={styles.statDivider} />
            <Stat value={String(TOURNAMENT.totalGroups)} label="Groups" />
          </View>
        ) : (
          <View testID="countdown">
            <Text style={styles.countdownLabel}>Kickoff in</Text>
            <View style={styles.countdownRow}>
              <CountUnit value={days} label="Days" />
              <Text style={styles.countdownColon}>:</Text>
              <CountUnit value={hours} label="Hours" pad />
              <Text style={styles.countdownColon}>:</Text>
              <CountUnit value={minutes} label="Minutes" pad />
              <Text style={styles.countdownColon}>:</Text>
              <CountUnit value={seconds} label="Seconds" pad muted />
            </View>
          </View>
        )}

        <View style={styles.liveStatusRow} testID="live-status">
          <View style={styles.liveStatusLeft}>
            <Animated.View
              style={[
                styles.liveStatusDot,
                liveCount > 0 ? styles.liveStatusDotHot : styles.liveStatusDotIdle,
                { opacity: pulse },
              ]}
            />
            <Text style={styles.liveStatusText}>
              {liveCount > 0 ? "LIVE NOW" : "AUTO-UPDATING"}
            </Text>
          </View>
          <TouchableOpacity
            testID="refresh-btn"
            onPress={refresh}
            activeOpacity={0.7}
            hitSlop={8}
            style={styles.refreshBtn}
          >
            <Text style={styles.refreshText}>{relUpdated}</Text>
            <RefreshCw size={14} color="rgba(244, 241, 232, 0.7)" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            const count =
              f.id === "all"
                ? matches.length
                : matches.filter((m) => m.status === f.id).length;
            return (
              <TouchableOpacity
                key={f.id}
                testID={`filter-${f.id}`}
                onPress={() => setFilter(f.id)}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.8}
              >
                {f.id === "live" && count > 0 ? (
                  <View style={styles.chipDot} />
                ) : null}
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.label}
                </Text>
                <View
                  style={[styles.chipCount, active && styles.chipCountActive]}
                >
                  <Text
                    style={[
                      styles.chipCountText,
                      active && styles.chipCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ paddingTop: 4 }}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No matches in this view</Text>
          </View>
        ) : (
          filtered.map((m) => <MatchCard key={m.id} match={m} />)
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CountUnit({
  value,
  label,
  pad,
  muted,
}: {
  value: number;
  label: string;
  pad?: boolean;
  muted?: boolean;
}) {
  const display = pad ? String(value).padStart(2, "0") : String(value);
  return (
    <View style={styles.countUnit}>
      <View style={styles.countBox}>
        <Text style={[styles.countValue, muted && styles.countValueMuted]}>
          {display}
        </Text>
      </View>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CFE8FF",
  },
  content: {
    paddingBottom: 16,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 18,
    backgroundColor: "#1E5BBF",
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.2)",
  },
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: "rgba(255, 200, 87, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroFlags: {
    fontSize: 18,
    letterSpacing: 2,
  },
  heroBadgeText: {
    color: Colors.palette.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: Colors.palette.white,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 6,
  },
  heroSub: {
    color: "rgba(244, 241, 232, 0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 18,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#11377A",
    borderRadius: 14,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: Colors.palette.gold,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    color: "rgba(244, 241, 232, 0.6)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  countdownLabel: {
    color: "rgba(244, 241, 232, 0.55)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countdownColon: {
    color: "rgba(255, 200, 87, 0.4)",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  countUnit: {
    alignItems: "center",
    flex: 1,
  },
  countBox: {
    backgroundColor: "#11377A",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignSelf: "stretch",
    alignItems: "center",
    marginHorizontal: 3,
  },
  countValue: {
    color: Colors.palette.gold,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  countValueMuted: {
    color: "rgba(255, 200, 87, 0.65)",
    fontSize: 22,
  },
  countLabel: {
    color: "rgba(244, 241, 232, 0.55)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 6,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  liveStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  liveStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  liveStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveStatusDotHot: {
    backgroundColor: Colors.palette.live,
  },
  liveStatusDotIdle: {
    backgroundColor: Colors.palette.electric,
  },
  liveStatusText: {
    color: "rgba(244, 241, 232, 0.85)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  liveStatusMeta: {
    color: "rgba(244, 241, 232, 0.6)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refreshText: {
    color: "rgba(244, 241, 232, 0.7)",
    fontSize: 11,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  filterRow: {
    marginBottom: 6,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: Colors.palette.gold,
    borderColor: Colors.palette.gold,
  },
  chipText: {
    color: Colors.palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  chipTextActive: {
    color: Colors.palette.ink,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.palette.live,
  },
  chipCount: {
    backgroundColor: Colors.palette.charcoal,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 22,
    alignItems: "center",
  },
  chipCountActive: {
    backgroundColor: "rgba(10, 15, 12, 0.18)",
  },
  chipCountText: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  chipCountTextActive: {
    color: Colors.palette.ink,
  },
  empty: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.palette.textDim,
    fontSize: 14,
    fontWeight: "600",
  },
});
