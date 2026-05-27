import { Stack, useLocalSearchParams } from "expo-router";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { getTeam } from "@/constants/worldcup";
import { useLiveData } from "@/providers/live-data-provider";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { matches } = useLiveData();
  const match = matches.find((m) => m.id === id);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (match?.status !== "live") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [match?.status, pulse]);

  if (!match) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Match not found</Text>
      </View>
    );
  }

  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <>
      <Stack.Screen options={{ title: match.stage }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            {isLive ? (
              <View style={styles.liveWrap}>
                <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
                <Text style={styles.liveText}>LIVE · {match.minute}&apos;</Text>
              </View>
            ) : (
              <Text style={styles.statusText}>
                {isFinished ? "FULL TIME" : "KICKOFF SOON"}
              </Text>
            )}
            {match.group ? (
              <View style={styles.groupChip}>
                <Text style={styles.groupChipText}>Group {match.group}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.matchUp}>
            <View style={styles.side}>
              <Text style={styles.bigFlag}>{home.flag}</Text>
              <Text style={styles.sideName}>{home.name}</Text>
              <Text style={styles.sideCode}>{home.short}</Text>
            </View>
            <View style={styles.scoreCenter}>
              {match.status === "upcoming" ? (
                <Text style={styles.vs}>VS</Text>
              ) : (
                <View style={styles.scoreRow}>
                  <Text
                    style={[
                      styles.bigScore,
                      (match.homeScore ?? 0) > (match.awayScore ?? 0) &&
                        styles.bigScoreWin,
                    ]}
                  >
                    {match.homeScore}
                  </Text>
                  <Text style={styles.scoreDash}>—</Text>
                  <Text
                    style={[
                      styles.bigScore,
                      (match.awayScore ?? 0) > (match.homeScore ?? 0) &&
                        styles.bigScoreWin,
                    ]}
                  >
                    {match.awayScore}
                  </Text>
                </View>
              )}
              <Text style={styles.kickoff}>
                {match.date} · {match.time}
              </Text>
            </View>
            <View style={styles.side}>
              <Text style={styles.bigFlag}>{away.flag}</Text>
              <Text style={styles.sideName}>{away.name}</Text>
              <Text style={styles.sideCode}>{away.short}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoTile
            icon={<MapPin size={16} color={Colors.palette.gold} strokeWidth={2.5} />}
            label="Venue"
            value={match.venue}
          />
          <InfoTile
            icon={<Trophy size={16} color={Colors.palette.gold} strokeWidth={2.5} />}
            label="Stage"
            value={match.stage}
          />
          <InfoTile
            icon={<Calendar size={16} color={Colors.palette.gold} strokeWidth={2.5} />}
            label="Date"
            value={match.date}
          />
          <InfoTile
            icon={<Clock size={16} color={Colors.palette.gold} strokeWidth={2.5} />}
            label="Kickoff"
            value={match.time}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Comparison</Text>
          <FormBar
            home={{ name: home.short, val: home.rank }}
            away={{ name: away.short, val: away.rank }}
            label="FIFA Ranking"
            invert
          />
        </View>
      </ScrollView>
    </>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function FormBar({
  home,
  away,
  label,
  invert,
}: {
  home: { name: string; val: number };
  away: { name: string; val: number };
  label: string;
  invert?: boolean;
}) {
  const total = home.val + away.val;
  const homePct = invert ? away.val / total : home.val / total;
  return (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formSide}>{home.name}</Text>
        <Text style={styles.formLabel}>{label}</Text>
        <Text style={styles.formSide}>{away.name}</Text>
      </View>
      <View style={styles.formTrack}>
        <View
          style={[
            styles.formFill,
            { width: `${homePct * 100}%`, backgroundColor: Colors.palette.electric },
          ]}
        />
        <View
          style={[
            styles.formFill,
            { width: `${(1 - homePct) * 100}%`, backgroundColor: Colors.palette.gold },
          ]}
        />
      </View>
      <View style={styles.formHeader}>
        <Text style={styles.formVal}>#{home.val}</Text>
        <Text style={styles.formVal}>#{away.val}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.palette.ink },
  content: { padding: 16, paddingBottom: 40 },
  empty: {
    flex: 1,
    backgroundColor: Colors.palette.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { color: Colors.palette.textMuted, fontSize: 16 },
  heroCard: {
    backgroundColor: Colors.palette.pitch,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.18)",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  liveWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 59, 92, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.palette.live,
  },
  liveText: { color: Colors.palette.live, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  statusText: {
    color: "rgba(244, 241, 232, 0.7)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  groupChip: {
    backgroundColor: "rgba(255, 200, 87, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  groupChipText: { color: Colors.palette.gold, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  matchUp: { flexDirection: "row", alignItems: "center" },
  side: { flex: 1, alignItems: "center", gap: 6 },
  bigFlag: { fontSize: 56 },
  sideName: {
    color: Colors.palette.white,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  sideCode: {
    color: "rgba(244, 241, 232, 0.6)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  scoreCenter: { alignItems: "center", paddingHorizontal: 10, gap: 6 },
  vs: {
    color: "rgba(244, 241, 232, 0.5)",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bigScore: {
    color: Colors.palette.white,
    fontSize: 44,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  bigScoreWin: { color: Colors.palette.gold },
  scoreDash: {
    color: "rgba(244, 241, 232, 0.4)",
    fontSize: 28,
    fontWeight: "800",
  },
  kickoff: {
    color: "rgba(244, 241, 232, 0.65)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  tile: {
    flex: 1,
    minWidth: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    borderRadius: 16,
    padding: 14,
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 200, 87, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: {
    color: Colors.palette.textDim,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  tileValue: {
    color: Colors.palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  section: { marginTop: 22 },
  sectionTitle: {
    color: Colors.palette.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  formCard: {
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formSide: { color: Colors.palette.text, fontSize: 13, fontWeight: "800" },
  formLabel: {
    color: Colors.palette.textDim,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  formVal: {
    color: Colors.palette.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  formTrack: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: Colors.palette.charcoal,
  },
  formFill: { height: "100%" },
});
