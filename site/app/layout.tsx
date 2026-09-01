import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Jeffrey Gomez — Datacenter technician & CS student",
  description: "Arlington / DC metro. Akkodis datacenter assignment, Frostburg CS (expected 2027), public Java/Python/SQL/C++.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
