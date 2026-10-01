export const UI_DIRECTIONS = ["studio", "spatial", "editorial"] as const;
export type UiDirection = (typeof UI_DIRECTIONS)[number];
export type Scheme = "light" | "dark";

export function parseUi(value: string | null | undefined): UiDirection | null {
  if (value === "studio" || value === "spatial" || value === "editorial") return value;
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
};
