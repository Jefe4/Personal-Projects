import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { Inter, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { UiProvider } from "@/components/UiProvider";
import { parseScheme, parseUi, type Scheme, type UiDirection } from "@/lib/ui";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const boot = `(function(){try{var q=new URLSearchParams(location.search).get("ui");var u=q||localStorage.getItem("jefe-ui");if(u!=="studio"&&u!=="spatial"&&u!=="editorial"){var legacy=localStorage.getItem("jefe-theme");u=legacy==="editorial"?"editorial":"studio";}var s=localStorage.getItem("jefe-scheme");if(s!=="light"&&s!=="dark"){s=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(u==="spatial")s="dark";document.documentElement.setAttribute("data-ui",u);document.documentElement.setAttribute("data-scheme",s);}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Jeffrey Gomez — Datacenter technician & CS student",
  description:
    "Arlington / DC metro. Akkodis datacenter assignment, Frostburg CS (expected 2027), public Java, Python, SQL, and C++.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const h = await headers();
  const ui: UiDirection = parseUi(h.get("x-jefe-ui")) ?? parseUi(jar.get("jefe-ui")?.value) ?? "studio";
  const scheme: Scheme = ui === "spatial" ? "dark" : (parseScheme(jar.get("jefe-scheme")?.value) ?? "light");

  return (
    <html lang="en" data-ui={ui} data-scheme={scheme} className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>
        <Script id="ui-boot" strategy="beforeInteractive">
          {boot}
        </Script>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <UiProvider initialUi={ui} initialScheme={scheme}>
          <Shell>{children}</Shell>
        </UiProvider>
      </body>
    </html>
  );
}
