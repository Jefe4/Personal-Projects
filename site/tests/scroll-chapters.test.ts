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
    expect(novum?.caveat).toMatch(/9\/10/);
    expect(novum?.caveat).toMatch(/0\.3\.7/);
    expect(`${novum?.plain} ${novum?.caveat}`).not.toMatch(/package\.json[^.]{0,40}0\.9\.0/);
    const tools = SCROLL_CHAPTERS.filter((chapter) => chapter.badge === "private repo");
    expect(tools.length).toBe(5);
    for (const id of ["esp32-serial-log", "rack-label-check", "gym-maint", "port-label-check"]) {
      expect(SCROLL_CHAPTERS.find((chapter) => chapter.id === id)?.plain).toMatch(/3 tests/);
    }
    expect(SCROLL_CHAPTERS.find((chapter) => chapter.id === "resume-json-check")?.plain).toMatch(/2 tests/);
  });

  it("keeps the engineering caveats on the scroll chapters", () => {
    const text = (id: string) => {
      const chapter = SCROLL_CHAPTERS.find((item) => item.id === id);
      return `${chapter?.plain} ${chapter?.caveat} ${chapter?.placeholder}`;
    };
    expect(text("kicad-board")).toMatch(/Not fabricated/);
    expect(text("kicad-board")).toMatch(/assumed/i);
    expect(text("kicad-board")).toMatch(/reverse-polarity/);
    expect(text("tinyml")).toMatch(/synthetic/i);
    expect(text("tinyml")).toMatch(/Not compiled for the ESP32/);
    expect(text("tinyml")).toMatch(/584/);
    expect(text("tinyml")).toMatch(/24\/24/);
    expect(text("mcp-servers")).toMatch(/Read-only/);
    expect(text("mcp-servers")).toMatch(/14 tests passed, 1 skipped/);
    expect(text("estop-firmware")).toMatch(/186 host checks/);
    expect(text("estop-firmware")).toMatch(/not tested on hardware/i);
    expect(text("recruiter-chat")).toMatch(/working demo|Ask about Jeffrey/);
    for (const id of ["kicad-board", "tinyml", "mcp-servers", "estop-firmware"]) {
      expect(SCROLL_CHAPTERS.find((item) => item.id === id)?.badge).toBe("Work in progress");
    }
  });
});
