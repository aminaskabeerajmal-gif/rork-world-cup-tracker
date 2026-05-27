import createContextHook from "@nkzw/create-context-hook";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import {
  MATCHES as BASE_MATCHES,
  Match,
  STANDINGS as BASE_STANDINGS,
  Standing,
  TEAMS,
  TOP_SCORERS as BASE_TOP_SCORERS,
  Scorer,
} from "@/constants/worldcup";

const TEAM_NAME_BY_ID: Record<string, string> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t.name.toLowerCase()])
);

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/** Parse a "Thu, Jun 11" + "15:00 ET" pair into a UTC epoch ms. June ET = EDT (UTC-4). */
function parseKickoffMs(dateStr: string, timeStr: string): number {
  const parts = dateStr.split(",")[1]?.trim().split(" ") ?? [];
  const month = MONTHS[parts[0] ?? ""] ?? 5;
  const day = Number(parts[1] ?? "11");
  const t = timeStr.split(" ")[0] ?? "00:00";
  const [hh, mm] = t.split(":").map((n) => Number(n));
  // Treat ET as EDT in June/July 2026 → UTC-4
  return Date.UTC(2026, month, day, (hh ?? 0) + 4, mm ?? 0, 0);
}

const KICKOFFS: Record<string, number> = Object.fromEntries(
  BASE_MATCHES.map((m) => [m.id, parseKickoffMs(m.date, m.time)])
);

const MATCH_DURATION_MS = 105 * 60 * 1000; // 90' + HT + injury buffer

/**
 * Compute live match status from the current wall clock. Until a real-time
 * FIFA feed is wired in, this gives a believable self-updating tracker.
 */
function computeMatches(now: number): Match[] {
  return BASE_MATCHES.map((m) => {
    const kickoff = KICKOFFS[m.id];
    if (now < kickoff) {
      return { ...m, status: "upcoming" as const };
    }
    if (now < kickoff + MATCH_DURATION_MS) {
      const minute = Math.min(
        90,
        Math.max(1, Math.floor((now - kickoff) / 60_000))
      );
      return { ...m, status: "live" as const, minute };
    }
    return { ...m, status: "finished" as const };
  });
}

function computeStandings(matches: Match[]): Record<string, Standing[]> {
  const out: Record<string, Standing[]> = {};
  for (const g of Object.keys(BASE_STANDINGS)) {
    out[g] = BASE_STANDINGS[g].map((s) => ({ ...s }));
  }
  for (const m of matches) {
    if (m.status !== "finished") continue;
    if (m.homeScore == null || m.awayScore == null) continue;
    const grp = m.group;
    if (!grp || !out[grp]) continue;
    const h = out[grp].find((s) => s.teamId === m.homeId);
    const a = out[grp].find((s) => s.teamId === m.awayId);
    if (!h || !a) continue;
    h.played += 1;
    a.played += 1;
    h.gf += m.homeScore;
    h.ga += m.awayScore;
    a.gf += m.awayScore;
    a.ga += m.homeScore;
    if (m.homeScore > m.awayScore) {
      h.won += 1; h.points += 3; a.lost += 1;
    } else if (m.homeScore < m.awayScore) {
      a.won += 1; a.points += 3; h.lost += 1;
    } else {
      h.drawn += 1; a.drawn += 1; h.points += 1; a.points += 1;
    }
  }
  for (const g of Object.keys(out)) {
    out[g].sort((x, y) => {
      if (y.points !== x.points) return y.points - x.points;
      const xgd = x.gf - x.ga;
      const ygd = y.gf - y.ga;
      if (ygd !== xgd) return ygd - xgd;
      return y.gf - x.gf;
    });
  }
  return out;
}

type LiveSnapshot = {
  matches: Match[];
  standings: Record<string, Standing[]>;
  scorers: Scorer[];
  fetchedAt: number;
};

/**
 * Best-effort live fetch. We try a public web source first; if it fails
 * (offline, CORS, rate-limited) we fall back to a clock-based simulation so
 * the UI always stays responsive and accurate around kickoff times.
 */
async function fetchSnapshot(): Promise<LiveSnapshot> {
  const now = Date.now();
  try {
    // Public, CORS-enabled scoreboard feed covering FIFA World Cup fixtures.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard",
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const json = (await res.json()) as { events?: { name?: string; status?: { type?: { state?: string }; displayClock?: string }; competitions?: { competitors?: { homeAway?: string; team?: { displayName?: string }; score?: string }[] }[] }[] };
      const events = Array.isArray(json.events) ? json.events : [];
      const live = new Map<string, { homeScore: number; awayScore: number; minute?: number; state?: string }>();
      for (const ev of events) {
        const comp = ev.competitions?.[0];
        const home = comp?.competitors?.find((c) => c.homeAway === "home");
        const away = comp?.competitors?.find((c) => c.homeAway === "away");
        const hName = home?.team?.displayName ?? "";
        const aName = away?.team?.displayName ?? "";
        if (!hName || !aName) continue;
        const key = `${hName.toLowerCase()}|${aName.toLowerCase()}`;
        const hs = Number(home?.score ?? "0");
        const as = Number(away?.score ?? "0");
        const clock = ev.status?.displayClock ?? "";
        const minute = Number(clock.split(":")[0]);
        live.set(key, {
          homeScore: Number.isFinite(hs) ? hs : 0,
          awayScore: Number.isFinite(as) ? as : 0,
          minute: Number.isFinite(minute) ? minute : undefined,
          state: ev.status?.type?.state,
        });
      }

      const baseMatches = computeMatches(now);
      const matches = baseMatches.map((m) => {
        const hn = TEAM_NAME_BY_ID[m.homeId] ?? "";
        const an = TEAM_NAME_BY_ID[m.awayId] ?? "";
        const found =
          live.get(`${hn}|${an}`) ??
          live.get(`${an}|${hn}`);
        if (!found) return m;
        const status =
          found.state === "in" ? "live" :
          found.state === "post" ? "finished" :
          found.state === "pre" ? "upcoming" : m.status;
        return {
          ...m,
          homeScore: found.homeScore,
          awayScore: found.awayScore,
          minute: found.minute ?? m.minute,
          status,
        };
      });
      return {
        matches,
        standings: computeStandings(matches),
        scorers: BASE_TOP_SCORERS,
        fetchedAt: now,
      };
    }
  } catch (err) {
    console.log("[live-data] remote fetch failed, using simulation", err);
  }

  const matches = computeMatches(now);
  return {
    matches,
    standings: computeStandings(matches),
    scorers: BASE_TOP_SCORERS,
    fetchedAt: now,
  };
}

export const [LiveDataProvider, useLiveData] = createContextHook(() => {
  const [userRefreshing, setUserRefreshing] = useState<boolean>(false);

  const query = useQuery<LiveSnapshot>({
    queryKey: ["worldcup-live"],
    queryFn: fetchSnapshot,
    // Auto-refresh every minute in the background.
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
    initialData: () => {
      const now = Date.now();
      const matches = computeMatches(now);
      return {
        matches,
        standings: computeStandings(matches),
        scorers: BASE_TOP_SCORERS,
        fetchedAt: now,
      };
    },
  });

  const data = query.data ?? {
    matches: BASE_MATCHES,
    standings: BASE_STANDINGS,
    scorers: BASE_TOP_SCORERS,
    fetchedAt: Date.now(),
  };

  const liveCount = useMemo(
    () => data.matches.filter((m) => m.status === "live").length,
    [data.matches]
  );

  const refresh = useCallback(async () => {
    setUserRefreshing(true);
    try {
      await query.refetch();
    } finally {
      setUserRefreshing(false);
    }
  }, [query]);

  return {
    matches: data.matches,
    standings: data.standings,
    scorers: data.scorers,
    fetchedAt: data.fetchedAt,
    liveCount,
    // Only reflect user-initiated refreshes so background polls don't keep
    // the RefreshControl spinning (which on web can swallow tab touches).
    isRefreshing: userRefreshing,
    refresh,
  };
});

export function getMatchById(matches: Match[], id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}
