import type { Metadata } from "next";
import localFont from "next/font/local";
import { PreferencesProvider } from "@/components/preferences-provider";
import "./globals.css";
import "./portfolio.css";

const display = localFont({ src: "../../public/assets/fonts/cinzel-latin-600.woff2", weight: "600", style: "normal", display: "swap", variable: "--font-display-face", fallback: ["Georgia"] });
const body = localFont({ src: "../../public/assets/fonts/source-sans-3-latin.woff2", weight: "200 900", style: "normal", display: "swap", variable: "--font-body-face", fallback: ["Arial"] });

export const metadata: Metadata = {
  title: { default: "The Village of Riyan", template: "%s | The Village of Riyan" },
  description: "An interactive medieval portfolio. A quiet place to discover Riyan’s work, skills, and story.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a>{children}<PreferencesProvider /></body></html>;
}
