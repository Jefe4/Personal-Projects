import { describe, expect, it } from "vitest";
import { SCROLL_CHAPTERS } from "../lib/scroll-chapters";

describe("scroll chapters", () => {
  it("includes the private tools, Novum, and a firmware placeholder with no invented source", () => {
    const ids = SCROLL_CHAPTERS.map((chapter) => chapter.id);
    for (const id of ["esp32-serial-log", "rack-label-check", "resume-json-check", "gym-maint", "port-label-check", "novum", "esp32-firmware"]) {
      expect(ids).toContain(id);
    }
    const firmware = SCROLL_CHAPTERS.find((chapter) => chapter.id === "esp32-firmware");
    expect(firmware?.placeholder?.toLowerCase()).toContain("placeholder");
    expect(firmware?.placeholder).not.toMatch(/#include|void setup|gpio_set_level/);
    const novum = SCROLL_CHAPTERS.find((chapter) => chapter.id === "novum");
    expect(novum?.badge?.toLowerCase()).toContain("progress");
    expect(novum?.plain.toLowerCase()).toContain("work in progress");
    const tools = SCROLL_CHAPTERS.filter((chapter) => chapter.badge === "private repo");
    expect(tools.length).toBe(5);
  });

  it("keeps KiCad, TinyML, and MCP honest when the source is missing", () => {
    for (const id of ["kicad-board", "tinyml", "mcp-servers"]) {
      const chapter = SCROLL_CHAPTERS.find((item) => item.id === id);
      expect(chapter?.badge).toBe("In progress, source coming");
      expect(chapter?.slug).toBeUndefined();
      const copy = `${chapter?.plain} ${chapter?.placeholder}`.toLowerCase();
      expect(copy).toContain("source coming");
      expect(copy).not.toMatch(/#include|kicad_pcb|def train|@modelcontextprotocol|gpio_set/);
    }
  });
});
