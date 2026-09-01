import excerpts from "@/content/excerpts.json";

export type Excerpt = { path: string; code: string; startLine: number; endLine: number };

export function excerptFor(slug: string): Excerpt | null {
  const all = excerpts as Record<string, Excerpt>;
  return all[slug] || null;
}

export function githubBlob(filePath: string) {
  return `https://github.com/Jefe4/Personal-Projects/blob/main/${filePath}`;
}
