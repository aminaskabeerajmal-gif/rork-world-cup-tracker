const palette = {
  pitch: "#0B6E3F",
  pitchDark: "#064027",
  pitchDeeper: "#03261A",
  ink: "#0A0F0C",
  charcoal: "#11181A",
  surface: "#161D1F",
  surfaceElevated: "#1E2629",
  border: "#26302F",
  gold: "#FFC857",
  goldDeep: "#E0A22F",
  crimson: "#E5383B",
  electric: "#3DD68C",
  ice: "#9AB0AE",
  text: "#F4F1E8",
  textMuted: "#8A9794",
  textDim: "#5C6967",
  white: "#FFFFFF",
  live: "#FF3B5C",
} as const;

export default {
  palette,
  light: {
    text: palette.text,
    background: palette.ink,
    tint: palette.gold,
    tabIconDefault: palette.textDim,
    tabIconSelected: palette.gold,
  },
};
