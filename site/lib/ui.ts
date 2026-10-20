export const UI_DIRECTIONS = ["studio", "spatial", "editorial", "showcase"] as const;
export type UiDirection = (typeof UI_DIRECTIONS)[number];
export type Scheme = "light" | "dark";

export function parseUi(value: string | null | undefined): UiDirection | null {
  if (value && (UI_DIRECTIONS as readonly string[]).includes(value)) return value as UiDirection;
  return null;
}

export function parseScheme(value: string | null | undefined): Scheme | null {
  if (value === "light" || value === "dark") return value;
  return null;
}

export const UI_LABEL: Record<UiDirection, string> = {
  studio: "Studio",
  spatial: "Spatial",
  editorial: "Editorial",
  showcase: "Showcase",
};

export const UI_BLURB: Record<UiDirection, string> = {
  studio: "Large type, sticky chapters, light or dark.",
  spatial: "Dark glass, gym-scan depth, projects on a shelf.",
  editorial: "Magazine grid, numbered sections, long case studies.",
  showcase: "Full-screen chapters, centered title, pill buttons.",
};

/** First visit only. A shareable ?ui=, a saved choice, or an explicit defer hides it. */
export function shouldOfferDirectionPicker(opts: {
  query: UiDirection | null;
  saved: UiDirection | null;
  legacyEditorial: boolean;
  deferred: boolean;
}): boolean {
  if (opts.query || opts.saved || opts.legacyEditorial || opts.deferred) return false;
  return true;
}
