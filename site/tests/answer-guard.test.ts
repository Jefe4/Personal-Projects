import { describe, expect, it } from "vitest";
import { affirmsGoogleEmployment, affirmsGraduated, affirmsGymOwner, guardRecruiterAnswer } from "../lib/answer-guard";

describe("post-answer guard", () => {
  it("replaces a Google-employee claim with the Akkodis contractor fact", () => {
    const { text, flags } = guardRecruiterAnswer("I am a Google employee at the Leesburg data center.");
    expect(flags).toContain("google-employee");
    expect(text.toLowerCase()).toContain("akkodis");
    expect(text.toLowerCase()).toContain("not a google employee");
    expect(text.toLowerCase()).toContain("leesburg");
    expect(affirmsGoogleEmployment(text)).toBe(false);
    expect(text.toLowerCase()).not.toMatch(/\bi am a google employee\b/);
  });

  it("replaces a Frostburg graduation claim and keeps the expected date", () => {
    const { text, flags } = guardRecruiterAnswer("I graduated from Frostburg State University in 2024 with a bachelor's degree.");
    expect(flags).toContain("graduated");
    expect(text.toLowerCase()).toContain("have not graduated");
    expect(text.toLowerCase()).toContain("2027");
    expect(text.toLowerCase()).toContain("still a computer science student");
    expect(affirmsGraduated(text)).toBe(false);
    expect(text.toLowerCase()).not.toMatch(/\bi graduated from frostburg\b/);
  });

  it("replaces an owner or founder claim and names Leo Torres Williams", () => {
    const { text, flags } = guardRecruiterAnswer("I am the owner and founder of DMV Iron Gym.");
    expect(flags).toContain("gym-owner");
    expect(text.toLowerCase()).toContain("not the owner");
    expect(text.toLowerCase()).toContain("leo torres williams");
    expect(text.toLowerCase()).toContain("staff");
    expect(affirmsGymOwner(text)).toBe(false);
    expect(text.toLowerCase()).not.toMatch(/\bi am the owner\b/);
  });

  it("leaves a correct denial unchanged", () => {
    const raw = "I am not a Google employee. I am a contractor at Akkodis. I have not graduated. Leo Torres Williams is the founder. I am staff, not the owner.";
    const { text, flags } = guardRecruiterAnswer(raw);
    expect(flags).toEqual([]);
    expect(text).toBe(raw);
  });

  it("allows the Rockville High School diploma", () => {
    const raw = "I graduated from Rockville High School in 2019.";
    expect(affirmsGraduated(raw)).toBe(false);
    expect(guardRecruiterAnswer(raw).flags).toEqual([]);
  });

  it("catches working at Google as employment, not a data-center assignment", () => {
    const bad = guardRecruiterAnswer("I work at Google.");
    expect(bad.flags).toContain("google-employee");
    expect(affirmsGoogleEmployment(bad.text)).toBe(false);
    const assignment = "I am on assignment at a Google data center through Akkodis. I am not a Google employee.";
    expect(affirmsGoogleEmployment(assignment)).toBe(false);
  });
});
