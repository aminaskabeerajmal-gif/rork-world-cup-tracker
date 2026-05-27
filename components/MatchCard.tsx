import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import React, { memo, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { Match, getTeam } from "@/constants/worldcup";

type Props = { match: Match };

function MatchCardBase({ match }: Props) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (match.status !== "live") return;
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
  }, [match.status, pulse]);

  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";

  return (
    <Pressable
      testID={`match-card-${match.id}`}
      onPress={() => router.push(`/match/${match.id}`)}
      style={({ pressed }) => [
        styles.card,
        isLive && styles.cardLive,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.stageWrap}>
          <Text style={styles.stage}>{match.stage}</Text>
          {match.group ? (
            <View style={styles.groupChip}>
              <Text style={styles.groupChipText}>Group {match.group}</Text>
            </View>
          ) : null}
        </View>
        {isLive ? (
          <View style={styles.liveWrap}>
            <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
            <Text style={styles.liveText}>LIVE · {match.minute}&apos;</Text>
          </View>
        ) : (
          <Text style={styles.timeText}>
            {isFinished ? "FT" : `${match.date} · ${match.time}`}
          </Text>
        )}
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.team}>
          <Text style={styles.flag}>{home.flag}</Text>
          <Text style={styles.teamName} numberOfLines={1}>
            {home.name}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          {isUpcoming ? (
            <Text style={styles.vsText}>VS</Text>
          ) : (
            <View style={styles.scoreInner}>
              <Text
                style={[
                  styles.scoreText,
                  (match.homeScore ?? 0) > (match.awayScore ?? 0) &&
                    styles.scoreWinner,
                ]}
              >
                {match.homeScore}
              </Text>
              <Text style={styles.scoreSep}>:</Text>
              <Text
                style={[
                  styles.scoreText,
                  (match.awayScore ?? 0) > (match.homeScore ?? 0) &&
                    styles.scoreWinner,
                ]}
              >
                {match.awayScore}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.team, styles.teamRight]}>
          <Text style={[styles.teamName, styles.teamNameRight]} numberOfLines={1}>
            {away.name}
          </Text>
          <Text style={styles.flag}>{away.flag}</Text>
        </View>
      </View>

      <View style={styles.venueRow}>
        <MapPin size={12} color={Colors.palette.textMuted} strokeWidth={2.5} />
        <Text style={styles.venueText} numberOfLines={1}>
          {match.venue} · {match.city}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.palette.surface,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.palette.border,
  },
  cardLive: {
    borderColor: Colors.palette.live,
    backgroundColor: "#1A1416",
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  stageWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stage: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  groupChip: {
    backgroundColor: Colors.palette.pitchDeeper,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  groupChipText: {
    color: Colors.palette.electric,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  liveWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 59, 92, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.palette.live,
  },
  liveText: {
    color: Colors.palette.live,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timeText: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  team: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  teamRight: {
    justifyContent: "flex-end",
  },
  flag: {
    fontSize: 28,
  },
  teamName: {
    color: Colors.palette.text,
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
  teamNameRight: {
    textAlign: "right",
  },
  scoreBox: {
    minWidth: 76,
    alignItems: "center",
  },
  scoreInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scoreText: {
    color: Colors.palette.textMuted,
    fontSize: 26,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  scoreWinner: {
    color: Colors.palette.gold,
  },
  scoreSep: {
    color: Colors.palette.textDim,
    fontSize: 22,
    fontWeight: "800",
  },
  vsText: {
    color: Colors.palette.textDim,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.palette.border,
  },
  venueText: {
    color: Colors.palette.textMuted,
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
});

export const MatchCard = memo(MatchCardBase);
