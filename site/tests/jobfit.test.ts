import { describe, expect, it } from "vitest";
import { fitJob } from "../lib/jobfit";

describe("job-fit never invents", () => {
  it("maps Java and SQL to repo evidence", () => {
    const { buckets } = fitJob("We need Java and SQL plus datacenter experience.");
    const java = buckets.find((b) => b.item === "java");
    expect(java?.status).toBe("must-evidence");
    expect(java?.evidence.join(" ")).toMatch(/Graph/);
    const sql = buckets.find((b) => b.item === "sql");
    expect(sql?.status).toBe("must-evidence");
  });

  it("marks Kubernetes as missing", () => {
    const { buckets } = fitJob("Must have Kubernetes production experience.");
    const k = buckets.find((b) => b.item.toLowerCase().includes("kubernetes"));
    expect(k?.status).toBe("missing");
  });

  it("does not treat gym founder JD as a match for ownership", () => {
    const { buckets } = fitJob("Seeking a founder/CEO who owns a gym chain.");
    const own = buckets.find((b) => b.item.toLowerCase().includes("founder"));
    expect(own?.status).toBe("missing");
    expect(own?.evidence.join(" ").toLowerCase()).toContain("team member");
  });

  it("degree-required is stretch with 2027 date", () => {
    const { buckets } = fitJob("Bachelor's degree required.");
    const d = buckets.find((b) => b.item.toLowerCase().includes("bachelor"));
    expect(d?.status).toBe("stretch");
    expect(d?.evidence.join(" ")).toContain("2027");
  });
});
