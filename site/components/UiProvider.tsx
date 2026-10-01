"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { parseScheme, parseUi, shouldOfferDirectionPicker, type Scheme, type UiDirection } from "@/lib/ui";

type UiContextValue = {
  ui: UiDirection;
  scheme: Scheme;
  setUi: (ui: UiDirection) => void;
  setScheme: (scheme: Scheme) => void;
  offerPicker: boolean;
  dismissPicker: () => void;
};

const UiContext = createContext<UiContextValue | null>(null);

function applyDom(ui: UiDirection, scheme: Scheme) {
  document.documentElement.dataset.ui = ui;
  document.documentElement.dataset.scheme = ui === "spatial" ? "dark" : scheme;
}

function writePref(ui: UiDirection, scheme: Scheme) {
  applyDom(ui, scheme);
  window.localStorage.setItem("jefe-ui", ui);
  window.localStorage.setItem("jefe-scheme", scheme);
  window.sessionStorage.removeItem("jefe-ui-defer");
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
  const [offerPicker, setOfferPicker] = useState(false);

  useEffect(() => {
    const q = parseUi(new URLSearchParams(window.location.search).get("ui"));
    const saved = parseUi(window.localStorage.getItem("jefe-ui"));
    const legacyEditorial = window.localStorage.getItem("jefe-theme") === "editorial";
    const deferred = window.sessionStorage.getItem("jefe-ui-defer") === "1";
    const storedScheme = parseScheme(window.localStorage.getItem("jefe-scheme")) ?? initialScheme;
    setSchemeState(storedScheme);

    if (q) {
      setUiState(q);
      setOfferPicker(false);
      writePref(q, storedScheme);
      return;
    }
    if (saved) {
      setUiState(saved);
      setOfferPicker(false);
      applyDom(saved, storedScheme);
      const url = new URL(window.location.href);
      if (url.searchParams.get("ui") !== saved) {
        url.searchParams.set("ui", saved);
        window.history.replaceState(null, "", url);
      }
      return;
    }
    if (legacyEditorial) {
      setUiState("editorial");
      setOfferPicker(false);
      writePref("editorial", storedScheme);
      return;
    }

    setUiState("studio");
    applyDom("studio", storedScheme);
    setOfferPicker(shouldOfferDirectionPicker({ query: null, saved: null, legacyEditorial: false, deferred }));
  }, [initialScheme]);

  const value = useMemo<UiContextValue>(
    () => ({
      ui,
      scheme,
      offerPicker,
      dismissPicker: () => {
        window.sessionStorage.setItem("jefe-ui-defer", "1");
        setOfferPicker(false);
      },
      setUi: (next) => {
        setUiState(next);
        setOfferPicker(false);
        writePref(next, scheme);
      },
      setScheme: (next) => {
        if (ui === "spatial") return;
        setSchemeState(next);
        if (window.localStorage.getItem("jefe-ui")) writePref(ui, next);
        else {
          window.localStorage.setItem("jefe-scheme", next);
          applyDom(ui, next);
        }
      },
    }),
    [ui, scheme, offerPicker],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside UiProvider");
  return ctx;
}
