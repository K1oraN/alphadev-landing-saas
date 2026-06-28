import type { CSSProperties } from "react";
import type { LandingTheme } from "../types/landing";

export const defaultLandingTheme: LandingTheme = {
  primaryColor: "#ef1d2f",
  secondaryColor: "#111116",
  backgroundColor: "#07070a",
  textColor: "#f8fafc",
  buttonColor: "#ef1d2f",
  buttonTextColor: "#ffffff",
  fontFamily: "Inter",
};

export function getLandingTheme(theme?: LandingTheme | null) {
  return theme ?? defaultLandingTheme;
}

export function getLandingThemeStyle(theme: LandingTheme) {
  return {
    "--landing-primary": theme.primaryColor,
    "--landing-secondary": theme.secondaryColor,
    "--landing-bg": theme.backgroundColor,
    "--landing-text": theme.textColor,
    "--landing-button": theme.buttonColor,
    "--landing-button-text": theme.buttonTextColor,
    color: theme.textColor,
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.fontFamily,
  } as CSSProperties;
}
