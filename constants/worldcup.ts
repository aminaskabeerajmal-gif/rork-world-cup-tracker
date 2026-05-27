export type Team = {
  id: string;
  name: string;
  short: string;
  flag: string;
  group: string;
  rank: number;
};

export type Match = {
  id: string;
  homeId: string;
  awayId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "live" | "upcoming" | "finished";
  minute?: number;
  date: string;
  time: string;
  stage: string;
  venue: string;
  city: string;
  group?: string;
};

export const TOURNAMENT = {
  name: "FIFA World Cup 2026",
  hosts: ["Canada", "United States", "Mexico"],
  hostFlags: "🇨🇦 🇺🇸 🇲🇽",
  startDate: "Jun 11, 2026",
  endDate: "Jul 19, 2026",
  totalTeams: 48,
  totalMatches: 104,
  totalGroups: 12,
  finalVenue: "MetLife Stadium",
  finalCity: "New York / New Jersey",
} as const;

/**
 * 48 qualified nations grouped by the final draw held in Washington, D.C.
 * on 5 December 2025, with the European and Intercontinental playoff winners
 * confirmed in March 2026. FIFA ranks are taken from the April 2026 ranking.
 */
export const TEAMS: Team[] = [
  { id: "MEX", name: "Mexico", short: "MEX", flag: "🇲🇽", group: "A", rank: 17 },
  { id: "KOR", name: "Korea Republic", short: "KOR", flag: "🇰🇷", group: "A", rank: 23 },
  { id: "RSA", name: "South Africa", short: "RSA", flag: "🇿🇦", group: "A", rank: 56 },
  { id: "CZE", name: "Czechia", short: "CZE", flag: "🇨🇿", group: "A", rank: 43 },

  { id: "CAN", name: "Canada", short: "CAN", flag: "🇨🇦", group: "B", rank: 28 },
  { id: "SUI", name: "Switzerland", short: "SUI", flag: "🇨🇭", group: "B", rank: 19 },
  { id: "QAT", name: "Qatar", short: "QAT", flag: "🇶🇦", group: "B", rank: 55 },
  { id: "BIH", name: "Bosnia & Herzegovina", short: "BIH", flag: "🇧🇦", group: "B", rank: 70 },

  { id: "BRA", name: "Brazil", short: "BRA", flag: "🇧🇷", group: "C", rank: 5 },
  { id: "MAR", name: "Morocco", short: "MAR", flag: "🇲🇦", group: "C", rank: 12 },
  { id: "SCO", name: "Scotland", short: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", rank: 42 },
  { id: "HAI", name: "Haiti", short: "HAI", flag: "🇭🇹", group: "C", rank: 82 },

  { id: "USA", name: "United States", short: "USA", flag: "🇺🇸", group: "D", rank: 15 },
  { id: "PAR", name: "Paraguay", short: "PAR", flag: "🇵🇾", group: "D", rank: 41 },
  { id: "AUS", name: "Australia", short: "AUS", flag: "🇦🇺", group: "D", rank: 26 },
  { id: "TUR", name: "Türkiye", short: "TUR", flag: "🇹🇷", group: "D", rank: 27 },

  { id: "GER", name: "Germany", short: "GER", flag: "🇩🇪", group: "E", rank: 10 },
  { id: "ECU", name: "Ecuador", short: "ECU", flag: "🇪🇨", group: "E", rank: 24 },
  { id: "CIV", name: "Côte d'Ivoire", short: "CIV", flag: "🇨🇮", group: "E", rank: 40 },
  { id: "CUR", name: "Curaçao", short: "CUR", flag: "🇨🇼", group: "E", rank: 89 },

  { id: "NED", name: "Netherlands", short: "NED", flag: "🇳🇱", group: "F", rank: 7 },
  { id: "JPN", name: "Japan", short: "JPN", flag: "🇯🇵", group: "F", rank: 18 },
  { id: "TUN", name: "Tunisia", short: "TUN", flag: "🇹🇳", group: "F", rank: 50 },
  { id: "SWE", name: "Sweden", short: "SWE", flag: "🇸🇪", group: "F", rank: 38 },

  { id: "BEL", name: "Belgium", short: "BEL", flag: "🇧🇪", group: "G", rank: 8 },
  { id: "IRN", name: "Iran", short: "IRN", flag: "🇮🇷", group: "G", rank: 21 },
  { id: "EGY", name: "Egypt", short: "EGY", flag: "🇪🇬", group: "G", rank: 33 },
  { id: "NZL", name: "New Zealand", short: "NZL", flag: "🇳🇿", group: "G", rank: 86 },

  { id: "ESP", name: "Spain", short: "ESP", flag: "🇪🇸", group: "H", rank: 2 },
  { id: "URU", name: "Uruguay", short: "URU", flag: "🇺🇾", group: "H", rank: 16 },
  { id: "KSA", name: "Saudi Arabia", short: "KSA", flag: "🇸🇦", group: "H", rank: 58 },
  { id: "CPV", name: "Cabo Verde", short: "CPV", flag: "🇨🇻", group: "H", rank: 73 },

  { id: "FRA", name: "France", short: "FRA", flag: "🇫🇷", group: "I", rank: 3 },
  { id: "SEN", name: "Senegal", short: "SEN", flag: "🇸🇳", group: "I", rank: 20 },
  { id: "NOR", name: "Norway", short: "NOR", flag: "🇳🇴", group: "I", rank: 32 },
  { id: "IRQ", name: "Iraq", short: "IRQ", flag: "🇮🇶", group: "I", rank: 59 },

  { id: "ARG", name: "Argentina", short: "ARG", flag: "🇦🇷", group: "J", rank: 1 },
  { id: "AUT", name: "Austria", short: "AUT", flag: "🇦🇹", group: "J", rank: 22 },
  { id: "ALG", name: "Algeria", short: "ALG", flag: "🇩🇿", group: "J", rank: 36 },
  { id: "JOR", name: "Jordan", short: "JOR", flag: "🇯🇴", group: "J", rank: 65 },

  { id: "POR", name: "Portugal", short: "POR", flag: "🇵🇹", group: "K", rank: 6 },
  { id: "COL", name: "Colombia", short: "COL", flag: "🇨🇴", group: "K", rank: 13 },
  { id: "UZB", name: "Uzbekistan", short: "UZB", flag: "🇺🇿", group: "K", rank: 57 },
  { id: "COD", name: "DR Congo", short: "COD", flag: "🇨🇩", group: "K", rank: 60 },

  { id: "ENG", name: "England", short: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", rank: 4 },
  { id: "CRO", name: "Croatia", short: "CRO", flag: "🇭🇷", group: "L", rank: 11 },
  { id: "PAN", name: "Panama", short: "PAN", flag: "🇵🇦", group: "L", rank: 39 },
  { id: "GHA", name: "Ghana", short: "GHA", flag: "🇬🇭", group: "L", rank: 72 },
];

/**
 * Full group-stage schedule (72 matches across 12 groups) based on the
 * official FIFA World Cup 2026 match schedule published 6 December 2025.
 * Kickoff times are in US Eastern Time. Group stage runs 11–27 June 2026.
 */
const mk = (
  id: string,
  homeId: string,
  awayId: string,
  date: string,
  time: string,
  venue: string,
  city: string,
  group: string,
  stage: string = "Group Stage"
): Match => ({
  id,
  homeId,
  awayId,
  homeScore: null,
  awayScore: null,
  status: "upcoming",
  date,
  time,
  stage,
  venue,
  city,
  group,
});

export const MATCHES: Match[] = [
  // ---------- Matchday 1 ----------
  mk("m1", "MEX", "RSA", "Thu, Jun 11", "15:00 ET", "Estadio Azteca", "Mexico City, MEX", "A", "Group Stage · Opening Match"),
  mk("m2", "KOR", "CZE", "Thu, Jun 11", "22:00 ET", "BC Place", "Vancouver, CAN", "A"),
  mk("m3", "CAN", "BIH", "Fri, Jun 12", "15:00 ET", "BMO Field", "Toronto, CAN", "B"),
  mk("m4", "USA", "PAR", "Fri, Jun 12", "21:00 ET", "SoFi Stadium", "Los Angeles, USA", "D"),
  mk("m5", "QAT", "SUI", "Sat, Jun 13", "15:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "B"),
  mk("m6", "BRA", "MAR", "Sat, Jun 13", "18:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "C"),
  mk("m7", "HAI", "SCO", "Sat, Jun 13", "21:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "C"),
  mk("m8", "AUS", "TUR", "Sun, Jun 14", "00:00 ET", "Estadio Akron", "Guadalajara, MEX", "D"),
  mk("m9", "GER", "CUR", "Sun, Jun 14", "13:00 ET", "AT&T Stadium", "Arlington, USA", "E"),
  mk("m10", "NED", "JPN", "Sun, Jun 14", "16:00 ET", "NRG Stadium", "Houston, USA", "F"),
  mk("m11", "CIV", "ECU", "Sun, Jun 14", "19:00 ET", "Hard Rock Stadium", "Miami, USA", "E"),
  mk("m12", "SWE", "TUN", "Sun, Jun 14", "22:00 ET", "Estadio BBVA", "Monterrey, MEX", "F"),
  mk("m13", "ESP", "CPV", "Mon, Jun 15", "12:00 ET", "Gillette Stadium", "Foxborough, USA", "H"),
  mk("m14", "BEL", "EGY", "Mon, Jun 15", "15:00 ET", "Lumen Field", "Seattle, USA", "G"),
  mk("m15", "KSA", "URU", "Mon, Jun 15", "18:00 ET", "Levi's Stadium", "Santa Clara, USA", "H"),
  mk("m16", "IRN", "NZL", "Mon, Jun 15", "21:00 ET", "Arrowhead Stadium", "Kansas City, USA", "G"),
  mk("m17", "FRA", "SEN", "Tue, Jun 16", "15:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "I"),
  mk("m18", "NOR", "IRQ", "Tue, Jun 16", "18:00 ET", "BMO Field", "Toronto, CAN", "I"),
  mk("m19", "ARG", "JOR", "Tue, Jun 16", "21:00 ET", "Hard Rock Stadium", "Miami, USA", "J"),
  mk("m20", "AUT", "ALG", "Wed, Jun 17", "12:00 ET", "Estadio Akron", "Guadalajara, MEX", "J"),
  mk("m21", "POR", "COD", "Wed, Jun 17", "15:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "K"),
  mk("m22", "COL", "UZB", "Wed, Jun 17", "18:00 ET", "Lumen Field", "Seattle, USA", "K"),
  mk("m23", "ENG", "CRO", "Wed, Jun 17", "21:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "L"),
  mk("m24", "PAN", "GHA", "Thu, Jun 18", "12:00 ET", "NRG Stadium", "Houston, USA", "L"),

  // ---------- Matchday 2 ----------
  mk("m25", "RSA", "CZE", "Thu, Jun 18", "15:00 ET", "Estadio BBVA", "Monterrey, MEX", "A"),
  mk("m26", "MEX", "KOR", "Thu, Jun 18", "21:00 ET", "Estadio Azteca", "Mexico City, MEX", "A"),
  mk("m27", "SUI", "BIH", "Fri, Jun 19", "12:00 ET", "AT&T Stadium", "Arlington, USA", "B"),
  mk("m28", "CAN", "QAT", "Fri, Jun 19", "18:00 ET", "BC Place", "Vancouver, CAN", "B"),
  mk("m29", "MAR", "SCO", "Fri, Jun 19", "15:00 ET", "Hard Rock Stadium", "Miami, USA", "C"),
  mk("m30", "BRA", "HAI", "Fri, Jun 19", "21:00 ET", "Gillette Stadium", "Foxborough, USA", "C"),
  mk("m31", "PAR", "TUR", "Sat, Jun 20", "12:00 ET", "Levi's Stadium", "Santa Clara, USA", "D"),
  mk("m32", "USA", "AUS", "Sat, Jun 20", "18:00 ET", "SoFi Stadium", "Los Angeles, USA", "D"),
  mk("m33", "ECU", "CUR", "Sat, Jun 20", "15:00 ET", "Arrowhead Stadium", "Kansas City, USA", "E"),
  mk("m34", "GER", "CIV", "Sat, Jun 20", "21:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "E"),
  mk("m35", "TUN", "JPN", "Sun, Jun 21", "12:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "F"),
  mk("m36", "NED", "SWE", "Sun, Jun 21", "18:00 ET", "NRG Stadium", "Houston, USA", "F"),
  mk("m37", "EGY", "NZL", "Sun, Jun 21", "15:00 ET", "BMO Field", "Toronto, CAN", "G"),
  mk("m38", "BEL", "IRN", "Sun, Jun 21", "21:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "G"),
  mk("m39", "URU", "CPV", "Mon, Jun 22", "12:00 ET", "Estadio Akron", "Guadalajara, MEX", "H"),
  mk("m40", "ESP", "KSA", "Mon, Jun 22", "18:00 ET", "AT&T Stadium", "Arlington, USA", "H"),
  mk("m41", "SEN", "IRQ", "Mon, Jun 22", "15:00 ET", "Lumen Field", "Seattle, USA", "I"),
  mk("m42", "FRA", "NOR", "Mon, Jun 22", "21:00 ET", "Hard Rock Stadium", "Miami, USA", "I"),
  mk("m43", "ALG", "JOR", "Tue, Jun 23", "12:00 ET", "BC Place", "Vancouver, CAN", "J"),
  mk("m44", "ARG", "AUT", "Tue, Jun 23", "18:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "J"),
  mk("m45", "COL", "COD", "Tue, Jun 23", "15:00 ET", "Levi's Stadium", "Santa Clara, USA", "K"),
  mk("m46", "POR", "UZB", "Tue, Jun 23", "21:00 ET", "Estadio BBVA", "Monterrey, MEX", "K"),
  mk("m47", "CRO", "GHA", "Wed, Jun 24", "12:00 ET", "Gillette Stadium", "Foxborough, USA", "L"),
  mk("m48", "ENG", "PAN", "Wed, Jun 24", "18:00 ET", "Arrowhead Stadium", "Kansas City, USA", "L"),

  // ---------- Matchday 3 (group finals, simultaneous kickoffs) ----------
  mk("m49", "CZE", "MEX", "Wed, Jun 24", "21:00 ET", "Estadio Azteca", "Mexico City, MEX", "A"),
  mk("m50", "RSA", "KOR", "Wed, Jun 24", "21:00 ET", "BC Place", "Vancouver, CAN", "A"),
  mk("m51", "BIH", "CAN", "Thu, Jun 25", "15:00 ET", "BMO Field", "Toronto, CAN", "B"),
  mk("m52", "SUI", "QAT", "Thu, Jun 25", "15:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "B"),
  mk("m53", "SCO", "BRA", "Thu, Jun 25", "21:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "C"),
  mk("m54", "HAI", "MAR", "Thu, Jun 25", "21:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "C"),
  mk("m55", "TUR", "USA", "Fri, Jun 26", "15:00 ET", "SoFi Stadium", "Los Angeles, USA", "D"),
  mk("m56", "AUS", "PAR", "Fri, Jun 26", "15:00 ET", "Estadio Akron", "Guadalajara, MEX", "D"),
  mk("m57", "CUR", "GER", "Fri, Jun 26", "21:00 ET", "AT&T Stadium", "Arlington, USA", "E"),
  mk("m58", "ECU", "CIV", "Fri, Jun 26", "21:00 ET", "Hard Rock Stadium", "Miami, USA", "E"),
  mk("m59", "JPN", "NED", "Sat, Jun 27", "12:00 ET", "NRG Stadium", "Houston, USA", "F"),
  mk("m60", "TUN", "SWE", "Sat, Jun 27", "12:00 ET", "Estadio BBVA", "Monterrey, MEX", "F"),
  mk("m61", "NZL", "BEL", "Sat, Jun 27", "16:00 ET", "Lumen Field", "Seattle, USA", "G"),
  mk("m62", "EGY", "IRN", "Sat, Jun 27", "16:00 ET", "Arrowhead Stadium", "Kansas City, USA", "G"),
  mk("m63", "CPV", "ESP", "Sat, Jun 27", "20:00 ET", "Gillette Stadium", "Foxborough, USA", "H"),
  mk("m64", "URU", "KSA", "Sat, Jun 27", "20:00 ET", "Levi's Stadium", "Santa Clara, USA", "H"),
  mk("m65", "IRQ", "FRA", "Sun, Jun 28", "12:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "I"),
  mk("m66", "NOR", "SEN", "Sun, Jun 28", "12:00 ET", "BMO Field", "Toronto, CAN", "I"),
  mk("m67", "JOR", "ARG", "Sun, Jun 28", "16:00 ET", "Hard Rock Stadium", "Miami, USA", "J"),
  mk("m68", "ALG", "AUT", "Sun, Jun 28", "16:00 ET", "Estadio Akron", "Guadalajara, MEX", "J"),
  mk("m69", "COD", "POR", "Sun, Jun 28", "20:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "K"),
  mk("m70", "UZB", "COL", "Sun, Jun 28", "20:00 ET", "Lumen Field", "Seattle, USA", "K"),
  mk("m71", "GHA", "ENG", "Mon, Jun 29", "15:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "L"),
  mk("m72", "PAN", "CRO", "Mon, Jun 29", "15:00 ET", "NRG Stadium", "Houston, USA", "L"),

  // ---------- Round of 32 (Jun 30 – Jul 3) ----------
  mk("m73", "W1A", "W3B", "Tue, Jun 30", "12:00 ET", "Estadio Akron", "Guadalajara, MEX", "", "Round of 32"),
  mk("m74", "W1C", "W3F", "Tue, Jun 30", "15:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "", "Round of 32"),
  mk("m75", "W2A", "W2C", "Tue, Jun 30", "18:00 ET", "NRG Stadium", "Houston, USA", "", "Round of 32"),
  mk("m76", "W1B", "W3A", "Tue, Jun 30", "21:00 ET", "AT&T Stadium", "Arlington, USA", "", "Round of 32"),
  mk("m77", "W1F", "W3C", "Wed, Jul 1", "12:00 ET", "BC Place", "Vancouver, CAN", "", "Round of 32"),
  mk("m78", "W1D", "W3E", "Wed, Jul 1", "15:00 ET", "Hard Rock Stadium", "Miami, USA", "", "Round of 32"),
  mk("m79", "W1E", "W3D", "Wed, Jul 1", "18:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "", "Round of 32"),
  mk("m80", "W2B", "W2F", "Wed, Jul 1", "21:00 ET", "Levi's Stadium", "Santa Clara, USA", "", "Round of 32"),
  mk("m81", "W1G", "W3H", "Thu, Jul 2", "12:00 ET", "Arrowhead Stadium", "Kansas City, USA", "", "Round of 32"),
  mk("m82", "W1H", "W3G", "Thu, Jul 2", "15:00 ET", "Gillette Stadium", "Foxborough, USA", "", "Round of 32"),
  mk("m83", "W2G", "W2I", "Thu, Jul 2", "18:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "", "Round of 32"),
  mk("m84", "W2H", "W2J", "Thu, Jul 2", "21:00 ET", "Estadio BBVA", "Monterrey, MEX", "", "Round of 32"),
  mk("m85", "W1I", "W3L", "Fri, Jul 3", "12:00 ET", "BMO Field", "Toronto, CAN", "", "Round of 32"),
  mk("m86", "W1J", "W3K", "Fri, Jul 3", "15:00 ET", "Lumen Field", "Seattle, USA", "", "Round of 32"),
  mk("m87", "W1K", "W2L", "Fri, Jul 3", "18:00 ET", "SoFi Stadium", "Los Angeles, USA", "", "Round of 32"),
  mk("m88", "W1L", "W2K", "Fri, Jul 3", "21:00 ET", "Estadio Azteca", "Mexico City, MEX", "", "Round of 32"),

  // ---------- Round of 16 (Jul 4 – Jul 7) ----------
  mk("m89", "W73", "W74", "Sat, Jul 4", "12:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "", "Round of 16"),
  mk("m90", "W75", "W76", "Sat, Jul 4", "16:00 ET", "AT&T Stadium", "Arlington, USA", "", "Round of 16"),
  mk("m91", "W77", "W78", "Sun, Jul 5", "12:00 ET", "Hard Rock Stadium", "Miami, USA", "", "Round of 16"),
  mk("m92", "W79", "W80", "Sun, Jul 5", "16:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "", "Round of 16"),
  mk("m93", "W81", "W82", "Mon, Jul 6", "15:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "", "Round of 16"),
  mk("m94", "W83", "W84", "Mon, Jul 6", "19:00 ET", "Estadio Azteca", "Mexico City, MEX", "", "Round of 16"),
  mk("m95", "W85", "W86", "Tue, Jul 7", "15:00 ET", "BMO Field", "Toronto, CAN", "", "Round of 16"),
  mk("m96", "W87", "W88", "Tue, Jul 7", "19:00 ET", "SoFi Stadium", "Los Angeles, USA", "", "Round of 16"),

  // ---------- Quarter-finals (Jul 9 – Jul 11) ----------
  mk("m97", "W89", "W90", "Thu, Jul 9", "15:00 ET", "Lincoln Financial Field", "Philadelphia, USA", "", "Quarter-final"),
  mk("m98", "W91", "W92", "Thu, Jul 9", "21:00 ET", "Levi's Stadium", "Santa Clara, USA", "", "Quarter-final"),
  mk("m99", "W93", "W94", "Fri, Jul 10", "16:00 ET", "Hard Rock Stadium", "Miami, USA", "", "Quarter-final"),
  mk("m100", "W95", "W96", "Sat, Jul 11", "16:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "", "Quarter-final"),

  // ---------- Semi-finals (Jul 14 – Jul 15) ----------
  mk("m101", "W97", "W98", "Tue, Jul 14", "15:00 ET", "AT&T Stadium", "Arlington, USA", "", "Semi-final"),
  mk("m102", "W99", "W100", "Wed, Jul 15", "15:00 ET", "Mercedes-Benz Stadium", "Atlanta, USA", "", "Semi-final"),

  // ---------- Third-place play-off ----------
  mk("m103", "L101", "L102", "Sat, Jul 18", "15:00 ET", "Hard Rock Stadium", "Miami, USA", "", "Third-place Play-off"),

  // ---------- Final ----------
  mk("m104", "W101", "W102", "Sun, Jul 19", "15:00 ET", "MetLife Stadium", "New York / New Jersey, USA", "", "Final"),
];

export type Standing = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
};

function emptyGroup(ids: string[]): Standing[] {
  return ids.map((teamId) => ({
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    points: 0,
  }));
}

/**
 * Standings are zeroed until the tournament kicks off on 11 June 2026.
 * Teams are listed in their pot order from the official draw.
 */
export const STANDINGS: Record<string, Standing[]> = {
  A: emptyGroup(["MEX", "KOR", "RSA", "CZE"]),
  B: emptyGroup(["CAN", "SUI", "QAT", "BIH"]),
  C: emptyGroup(["BRA", "MAR", "SCO", "HAI"]),
  D: emptyGroup(["USA", "PAR", "AUS", "TUR"]),
  E: emptyGroup(["GER", "ECU", "CIV", "CUR"]),
  F: emptyGroup(["NED", "JPN", "TUN", "SWE"]),
  G: emptyGroup(["BEL", "IRN", "EGY", "NZL"]),
  H: emptyGroup(["ESP", "URU", "KSA", "CPV"]),
  I: emptyGroup(["FRA", "SEN", "NOR", "IRQ"]),
  J: emptyGroup(["ARG", "AUT", "ALG", "JOR"]),
  K: emptyGroup(["POR", "COL", "UZB", "COD"]),
  L: emptyGroup(["ENG", "CRO", "PAN", "GHA"]),
};

export type Scorer = {
  rank: number;
  teamId: string;
  name: string;
  goals: number;
  assists: number;
};

/**
 * Golden Boot tracker is empty until the first ball is kicked at the
 * FIFA World Cup 2026 on 11 June 2026.
 */
export const TOP_SCORERS: Scorer[] = [];

export type GoldenBootCandidate = {
  name: string;
  teamId: string;
  position: string;
  club: string;
  shirt: number;
  age: number;
  /** Pre-tournament Golden Boot odds shown as decimal (lower = favourite). */
  odds: number;
};

/**
 * Headline strikers and creators expected at the FIFA World Cup 2026.
 * Each entry is wired to a live score slot that fills in goals/assists as
 * the tournament unfolds. Sources: official squad announcements published
 * May 2026 plus Opta/SofaScore Golden Boot market (as of 10 May 2026).
 */
export const GOLDEN_BOOT_CANDIDATES: GoldenBootCandidate[] = [
  { name: "Kylian Mbapp\u00e9", teamId: "FRA", position: "FW", club: "Real Madrid", shirt: 10, age: 27, odds: 6.5 },
  { name: "Erling Haaland", teamId: "NOR", position: "FW", club: "Manchester City", shirt: 9, age: 25, odds: 7.0 },
  { name: "Lionel Messi", teamId: "ARG", position: "FW", club: "Inter Miami", shirt: 10, age: 38, odds: 12.0 },
  { name: "Julian Alvarez", teamId: "ARG", position: "FW", club: "Atl\u00e9tico Madrid", shirt: 9, age: 26, odds: 11.0 },
  { name: "Harry Kane", teamId: "ENG", position: "FW", club: "Bayern Munich", shirt: 9, age: 32, odds: 7.5 },
  { name: "Jude Bellingham", teamId: "ENG", position: "MF", club: "Real Madrid", shirt: 10, age: 22, odds: 15.0 },
  { name: "Bukayo Saka", teamId: "ENG", position: "FW", club: "Arsenal", shirt: 7, age: 24, odds: 21.0 },
  { name: "Vin\u00edcius J\u00fanior", teamId: "BRA", position: "FW", club: "Real Madrid", shirt: 7, age: 25, odds: 10.0 },
  { name: "Rodrygo", teamId: "BRA", position: "FW", club: "Real Madrid", shirt: 11, age: 25, odds: 18.0 },
  { name: "Estev\u00e3o", teamId: "BRA", position: "FW", club: "Chelsea", shirt: 19, age: 19, odds: 26.0 },
  { name: "Lamine Yamal", teamId: "ESP", position: "FW", club: "Barcelona", shirt: 19, age: 18, odds: 9.0 },
  { name: "Nico Williams", teamId: "ESP", position: "FW", club: "Athletic Club", shirt: 17, age: 23, odds: 22.0 },
  { name: "\u00c1lvaro Morata", teamId: "ESP", position: "FW", club: "Galatasaray", shirt: 7, age: 33, odds: 28.0 },
  { name: "Cristiano Ronaldo", teamId: "POR", position: "FW", club: "Al-Nassr", shirt: 7, age: 41, odds: 25.0 },
  { name: "Rafael Le\u00e3o", teamId: "POR", position: "FW", club: "AC Milan", shirt: 17, age: 26, odds: 30.0 },
  { name: "Bruno Fernandes", teamId: "POR", position: "MF", club: "Manchester United", shirt: 8, age: 31, odds: 34.0 },
  { name: "Florian Wirtz", teamId: "GER", position: "MF", club: "Liverpool", shirt: 10, age: 23, odds: 19.0 },
  { name: "Kai Havertz", teamId: "GER", position: "FW", club: "Arsenal", shirt: 7, age: 26, odds: 26.0 },
  { name: "Jamal Musiala", teamId: "GER", position: "MF", club: "Bayern Munich", shirt: 14, age: 22, odds: 22.0 },
  { name: "Memphis Depay", teamId: "NED", position: "FW", club: "Corinthians", shirt: 10, age: 32, odds: 33.0 },
  { name: "Cody Gakpo", teamId: "NED", position: "FW", club: "Liverpool", shirt: 8, age: 26, odds: 28.0 },
  { name: "Xavi Simons", teamId: "NED", position: "MF", club: "Tottenham", shirt: 7, age: 22, odds: 35.0 },
  { name: "Romelu Lukaku", teamId: "BEL", position: "FW", club: "Napoli", shirt: 9, age: 33, odds: 28.0 },
  { name: "Kevin De Bruyne", teamId: "BEL", position: "MF", club: "Napoli", shirt: 7, age: 34, odds: 40.0 },
  { name: "Jeremy Doku", teamId: "BEL", position: "FW", club: "Manchester City", shirt: 11, age: 24, odds: 45.0 },
  { name: "Mohamed Salah", teamId: "EGY", position: "FW", club: "Liverpool", shirt: 10, age: 33, odds: 20.0 },
  { name: "Christian Pulisic", teamId: "USA", position: "FW", club: "AC Milan", shirt: 10, age: 27, odds: 30.0 },
  { name: "Folarin Balogun", teamId: "USA", position: "FW", club: "Monaco", shirt: 9, age: 24, odds: 45.0 },
  { name: "Ra\u00fal Jim\u00e9nez", teamId: "MEX", position: "FW", club: "Fulham", shirt: 9, age: 34, odds: 50.0 },
  { name: "Santiago Gim\u00e9nez", teamId: "MEX", position: "FW", club: "AC Milan", shirt: 11, age: 25, odds: 40.0 },
  { name: "Jonathan David", teamId: "CAN", position: "FW", club: "Juventus", shirt: 20, age: 26, odds: 50.0 },
  { name: "Alphonso Davies", teamId: "CAN", position: "DF", club: "Bayern Munich", shirt: 19, age: 25, odds: 80.0 },
  { name: "Achraf Hakimi", teamId: "MAR", position: "DF", club: "Paris Saint-Germain", shirt: 2, age: 27, odds: 80.0 },
  { name: "Hakim Ziyech", teamId: "MAR", position: "MF", club: "Al Duhail", shirt: 7, age: 33, odds: 90.0 },
  { name: "Sadio Man\u00e9", teamId: "SEN", position: "FW", club: "Al-Nassr", shirt: 10, age: 34, odds: 40.0 },
  { name: "Nicol\u00f2 Barella", teamId: "ESP", position: "MF", club: "Inter", shirt: 23, age: 29, odds: 90.0 },
  { name: "Granit Xhaka", teamId: "SUI", position: "MF", club: "Bayer Leverkusen", shirt: 10, age: 33, odds: 90.0 },
  { name: "Breel Embolo", teamId: "SUI", position: "FW", club: "Monaco", shirt: 7, age: 29, odds: 60.0 },
  { name: "Luka Modri\u0107", teamId: "CRO", position: "MF", club: "AC Milan", shirt: 10, age: 40, odds: 80.0 },
  { name: "Andrej Kramari\u0107", teamId: "CRO", position: "FW", club: "Hoffenheim", shirt: 9, age: 35, odds: 70.0 },
  { name: "Takefusa Kubo", teamId: "JPN", position: "FW", club: "Real Sociedad", shirt: 11, age: 24, odds: 55.0 },
  { name: "Kaoru Mitoma", teamId: "JPN", position: "FW", club: "Brighton", shirt: 9, age: 28, odds: 60.0 },
  { name: "Mehdi Taremi", teamId: "IRN", position: "FW", club: "Inter", shirt: 9, age: 33, odds: 60.0 },
  { name: "Sardar Azmoun", teamId: "IRN", position: "FW", club: "Shabab Al-Ahli", shirt: 20, age: 31, odds: 80.0 },
  { name: "Darwin N\u00fa\u00f1ez", teamId: "URU", position: "FW", club: "Al-Hilal", shirt: 9, age: 26, odds: 25.0 },
  { name: "Federico Valverde", teamId: "URU", position: "MF", club: "Real Madrid", shirt: 15, age: 27, odds: 45.0 },
  { name: "Luis D\u00edaz", teamId: "COL", position: "FW", club: "Bayern Munich", shirt: 7, age: 29, odds: 22.0 },
  { name: "James Rodr\u00edguez", teamId: "COL", position: "MF", club: "Le\u00f3n", shirt: 10, age: 34, odds: 55.0 },
  { name: "Mohammed Kudus", teamId: "GHA", position: "FW", club: "Tottenham", shirt: 14, age: 25, odds: 55.0 },
  { name: "Iliman Ndiaye", teamId: "SEN", position: "FW", club: "Everton", shirt: 14, age: 26, odds: 70.0 },
  { name: "Marko Arnautovi\u0107", teamId: "AUT", position: "FW", club: "Red Bull Salzburg", shirt: 7, age: 37, odds: 75.0 },
  { name: "Hwang Hee-chan", teamId: "KOR", position: "FW", club: "Wolves", shirt: 11, age: 30, odds: 70.0 },
  { name: "Son Heung-min", teamId: "KOR", position: "FW", club: "LAFC", shirt: 7, age: 33, odds: 45.0 },
  { name: "Arda G\u00fcler", teamId: "TUR", position: "MF", club: "Real Madrid", shirt: 10, age: 21, odds: 50.0 },
  { name: "Hakan \u00c7alhano\u011flu", teamId: "TUR", position: "MF", club: "Inter", shirt: 8, age: 32, odds: 70.0 },
  { name: "Sebasti\u00e1n Driussi", teamId: "ARG", position: "FW", club: "River Plate", shirt: 19, age: 30, odds: 90.0 },
];

/**
 * Placeholder ids for knockout bracket slots that aren't filled yet.
 *  - `W{group}` / `R{group}` → group winner / runner-up (e.g. `W1A`, `W2B`)
 *  - `W{matchNo}` → winner of an earlier knockout match (e.g. `W73`)
 *  - `L{matchNo}` → loser (used by the third-place play-off)
 *  - `W3{letter}` → best third-place team slotted into that bracket position
 */
function placeholderTeam(id: string): Team | null {
  if (/^W1[A-L]$/.test(id)) return { id, name: `Winner Group ${id.slice(2)}`, short: id, flag: "🏆", group: "?", rank: 99 };
  if (/^W2[A-L]$/.test(id)) return { id, name: `Runner-up Group ${id.slice(2)}`, short: id, flag: "🥈", group: "?", rank: 99 };
  if (/^W3[A-L]$/.test(id)) return { id, name: `3rd Place ${id.slice(2)}`, short: id, flag: "🥉", group: "?", rank: 99 };
  if (/^W\d+$/.test(id)) return { id, name: `Winner Match ${id.slice(1)}`, short: id, flag: "⚽️", group: "?", rank: 99 };
  if (/^L\d+$/.test(id)) return { id, name: `Loser Match ${id.slice(1)}`, short: id, flag: "⚽️", group: "?", rank: 99 };
  return null;
}

export function getTeam(id: string): Team {
  const t = TEAMS.find((x) => x.id === id);
  if (t) return t;
  const p = placeholderTeam(id);
  if (p) return p;
  return { id, name: id, short: id, flag: "🏳️", group: "?", rank: 99 };
}
