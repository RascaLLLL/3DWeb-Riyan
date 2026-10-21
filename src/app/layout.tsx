import type { Metadata } from "next";
import { PreferencesProvider } from "@/components/preferences-provider";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: { default: "The Village of Riyan", template: "%s | The Village of Riyan" },
  description: "An interactive medieval portfolio. A quiet place to discover Riyan’s work, skills, and story.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}<PreferencesProvider /></body></html>;
}
