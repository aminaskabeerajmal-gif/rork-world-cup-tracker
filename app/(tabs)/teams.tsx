import { router } from "expo-router";
import { Heart, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { TEAMS, Team } from "@/constants/worldcup";
import { useFavorites } from "@/providers/favorites-provider";

export default function TeamsScreen() {
  const [query, setQuery] = useState<string>("");
  const [onlyFavs, setOnlyFavs] = useState<boolean>(false);
  const { favorites, toggle, isFavorite } = useFavorites();

  const data = useMemo(() => {
    let list = TEAMS;
    if (onlyFavs) list = list.filter((t) => favorites.includes(t.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.short.toLowerCase().includes(q) ||
          t.group.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => a.rank - b.rank);
  }, [query, onlyFavs, favorites]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <View style={styles.searchInner}>
          <Search size={16} color={Colors.palette.textMuted} strokeWidth={2.5} />
          <TextInput
            testID="teams-search"
            placeholder="Search teams"
            placeholderTextColor={Colors.palette.textDim}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity
          testID="favs-toggle"
          onPress={() => setOnlyFavs((v) => !v)}
          style={[styles.favToggle, onlyFavs && styles.favToggleActive]}
          activeOpacity={0.85}
        >
          <Heart
            size={16}
            color={onlyFavs ? Colors.palette.ink : Colors.palette.gold}
            fill={onlyFavs ? Colors.palette.ink : "transparent"}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {onlyFavs ? "No favorite teams yet" : "No teams found"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TeamRow
            team={item}
            isFav={isFavorite(item.id)}
            onToggle={() => toggle(item.id)}
          />
        )}
      />
    </View>
  );
}

function TeamRow({
  team,
  isFav,
  onToggle,
}: {
  team: Team;
  isFav: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      testID={`team-row-${team.id}`}
      onPress={() => router.push(`/team/${team.id}`)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.flagWrap}>
        <Text style={styles.flag}>{team.flag}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{team.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.groupChip}>
            <Text style={styles.groupChipText}>Group {team.group}</Text>
          </View>
          <Text style={styles.metaText}>FIFA #{team.rank}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        hitSlop={12}
        style={styles.heartBtn}
        activeOpacity={0.7}
      >
        <Heart
          size={20}
          color={isFav ? Colors.palette.crimson : Colors.palette.textDim}
          fill={isFav ? Colors.palette.crimson : "transparent"}
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.palette.ink },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    color: Colors.palette.text,
    fontSize: 14,
    fontWeight: "500",
  },
  favToggle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
  },
  favToggleActive: {
    backgroundColor: Colors.palette.gold,
    borderColor: Colors.palette.gold,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.palette.surface,
    borderWidth: 1,
    borderColor: Colors.palette.border,
    borderRadius: 16,
    marginBottom: 8,
  },
  flagWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.palette.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  flag: { fontSize: 28 },
  name: {
    color: Colors.palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  groupChip: {
    backgroundColor: Colors.palette.pitchDeeper,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupChipText: {
    color: Colors.palette.electric,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metaText: {
    color: Colors.palette.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  heartBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { paddingVertical: 64, alignItems: "center" },
  emptyText: {
    color: Colors.palette.textDim,
    fontSize: 14,
    fontWeight: "600",
  },
});
