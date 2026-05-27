import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wc_favorites_v1";

export const [FavoritesProvider, useFavorites] = createContextHook(() => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: async (): Promise<string[]> => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw) as string[];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.log("[favorites] parse error", e);
        return [];
      }
    },
  });

  useEffect(() => {
    if (loadQuery.data) {
      setFavorites(loadQuery.data);
    }
  }, [loadQuery.data]);

  const persist = useMutation({
    mutationFn: async (next: string[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    },
  });

  const toggle = useCallback(
    (teamId: string) => {
      setFavorites((prev) => {
        const next = prev.includes(teamId)
          ? prev.filter((id) => id !== teamId)
          : [...prev, teamId];
        persist.mutate(next);
        return next;
      });
    },
    [persist]
  );

  const isFavorite = useCallback(
    (teamId: string) => favorites.includes(teamId),
    [favorites]
  );

  return { favorites, toggle, isFavorite, isLoading: loadQuery.isLoading };
});
