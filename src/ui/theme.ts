/**
 * Tema dasar aplikasi.
 *
 * Nilai visual bukan bagian dari business rule; jangan menaruh perhitungan
 * bisnis di lapisan UI (AGENTS.md §7).
 */
export const colors = {
  background: "#F7F8FA",
  surface: "#FFFFFF",
  border: "#E3E6EB",
  text: "#1B1F27",
  textMuted: "#6B7280",
  primary: "#1F6FEB",
  danger: "#C0392B",
  success: "#1E8E5A",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  pill: 999,
} as const;

export const typography = {
  label: 13,
  body: 15,
  heading: 20,
  title: 24,
} as const;
