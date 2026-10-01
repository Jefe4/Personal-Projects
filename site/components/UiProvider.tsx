"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { parseScheme, parseUi, type Scheme, type UiDirection } from "@/lib/ui";

type UiContextValue = {
  ui: UiDirection;
  scheme: Scheme;
  setUi: (ui: UiDirection) => void;
  setScheme: (scheme: Scheme) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

function writePref(ui: UiDirection, scheme: Scheme) {
  const applied: Scheme = ui === "spatial" ? "dark" : scheme;
  document.documentElement.dataset.ui = ui;
  document.documentElement.dataset.scheme = applied;
  window.localStorage.setItem("jefe-ui", ui);
  window.localStorage.setItem("jefe-scheme", scheme);
  document.cookie = `jefe-ui=${ui}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = `jefe-scheme=${scheme}; path=/; max-age=31536000; samesite=lax`;
  const url = new URL(window.location.href);
  url.searchParams.set("ui", ui);
  window.history.replaceState(null, "", url);
}

export function UiProvider({
  initialUi,
  initialScheme,
  children,
}: {
  initialUi: UiDirection;
  initialScheme: Scheme;
  children: ReactNode;
}) {
  const [ui, setUiState] = useState<UiDirection>(initialUi);
  const [scheme, setSchemeState] = useState<Scheme>(initialScheme);

  useEffect(() => {
    const q = parseUi(new URLSearchParams(window.location.search).get("ui"));
    const saved = parseUi(window.localStorage.getItem("jefe-ui"));
    const legacy = window.localStorage.getItem("jefe-theme");
    const next = q ?? saved ?? (legacy === "editorial" ? "editorial" : initialUi);
    const storedScheme = parseScheme(window.localStorage.getItem("jefe-scheme")) ?? initialScheme;
    setUiState(next);
    setSchemeState(storedScheme);
    document.documentElement.dataset.ui = next;
    document.documentElement.dataset.scheme = next === "spatial" ? "dark" : storedScheme;
    window.localStorage.setItem("jefe-ui", next);
    document.cookie = `jefe-ui=${next}; path=/; max-age=31536000; samesite=lax`;
    const url = new URL(window.location.href);
    if (url.searchParams.get("ui") !== next) {
      url.searchParams.set("ui", next);
      window.history.replaceState(null, "", url);
    }
  }, [initialScheme, initialUi]);

  const value = useMemo<UiContextValue>(
    () => ({
      ui,
      scheme,
      setUi: (next) => {
        setUiState(next);
        writePref(next, scheme);
      },
      setScheme: (next) => {
        if (ui === "spatial") return;
        setSchemeState(next);
        writePref(ui, next);
      },
    }),
    [ui, scheme],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside UiProvider");
  return ctx;
}
