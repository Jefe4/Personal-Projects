import { describe, expect, it } from "vitest";
import { studyFor } from "../lib/case-studies";
import { getProfile } from "../lib/profile";
import { answerFromRetrieval } from "../lib/retrieve";

function copy(slug: string) {
  const study = studyFor(slug);
  const project = getProfile().projects.find((item) => item.slug === slug);
  return [
    project?.summary,
    study.problem,
    ...(study.caveats || []),
    ...(study.constraints || []),
    ...study.built,
    ...(study.result || []),
    ...(study.history || []),
    ...(study.quotes || []).flatMap((quote) => [quote.caption, quote.code]),
  ].join("\n");
}

describe("verified engineering write-ups keep their limits", () => {
  it("calls Novum 0.9.0 from the verify report and keeps 0.3.7 as history", () => {
    const text = copy("novum");
    expect(text).toMatch(/work in progress/i);
    expect(text).toMatch(/0\.9\.0/);
    expect(text).toMatch(/verify report/);
    expect(text).toMatch(/installed app/);
    expect(text).toMatch(/9\/10/);
    expect(text).toMatch(/6\/10/);
    expect(text).toMatch(/11 \/ 7 \/ 2/);
    expect(text).toMatch(/0 \/ 7 \/ 13/);
    expect(text).toMatch(/2\.0 s/);
    expect(text).toMatch(/300 MB/);
    expect(text).toMatch(/18\/18/);
    expect(text).toMatch(/0\.8\.4/);
    expect(text).toMatch(/0\.3\.7/);
    expect(text).toMatch(/Not done/);
    expect(text).toMatch(/applyPerfMode/);
    expect(text).toMatch(/trimAtCap/);
    expect(text).toMatch(/29bde88/);
    expect(text).not.toMatch(/package\.json[^.]{0,80}0\.9\.0|version": "0\.9\.0"/);
  });

  it("shows the KiCad v2 board without a fabrication claim", () => {
    const text = copy("kicad-board");
    expect(text).toMatch(/100\s*×\s*72/);
    expect(text).toMatch(/2 copper layers|2-layer|Two copper layers/);
    expect(text).toMatch(/ERC/);
    expect(text).toMatch(/DRC/);
    expect(text).toMatch(/Not fabricated/);
    expect(text).toMatch(/assumed/i);
    expect(text).toMatch(/reverse-polarity/);
    expect(text).not.toMatch(/was fabricated|has been fabricated|ordered from/);
  });

  it("does not present TinyML's 1.0 as real-dog accuracy", () => {
    const text = copy("tinyml");
    expect(text).toMatch(/584/);
    expect(text).toMatch(/24\/24/);
    expect(text).toMatch(/synthetic/i);
    expect(text).toMatch(/not real-dog|not real dogs/i);
    expect(text).toMatch(/Not compiled for the ESP32/);
    expect(text).toMatch(/classify_window|isfinite/);
    expect(text).toMatch(/not real-dog accuracy|not real dogs/i);
    expect(text).not.toMatch(/real-dog accuracy of 1|accuracy on real dogs is 1/);
  });

  it("keeps the MCP servers read-only and reports the skip", () => {
    const text = copy("mcp-servers");
    expect(text).toMatch(/Read-only|read-only/);
    expect(text).toMatch(/JavaScript/);
    expect(text).toMatch(/14/);
    expect(text).toMatch(/skipped/i);
    expect(text).toMatch(/path escapes root/);
    expect(text).toMatch(/Not published/);
  });

  it("keeps the e-stop firmware on the host", () => {
    const text = copy("estop-firmware");
    expect(text).toMatch(/186/);
    expect(text).toMatch(/Not compiled for the ESP32/);
    expect(text).toMatch(/not tested on hardware/i);
    expect(text).toMatch(/EstopGuard/);
    expect(text).toMatch(/not been bought/);
  });

  it("answers a TinyML question with the synthetic caveat", () => {
    const answer = answerFromRetrieval("What is the TinyML accuracy?").answer;
    expect(answer.toLowerCase()).toMatch(/synthetic/);
    expect(answer).toMatch(/not real dogs/);
  });
});
