import { describe, expect, it } from "vitest";
import { answerFromRetrieval } from "../lib/retrieve";
import profile from "../content/jeffrey.json";

describe("chat retrieval does not hallucinate", () => {
  it("education is Frostburg expected 2027, not a conferred degree, not UMass", () => {
    const { answer } = answerFromRetrieval("Where did you go to school? Did you graduate?");
    expect(answer.toLowerCase()).toContain("frostburg");
    expect(answer.toLowerCase()).toContain("2027");
    expect(answer.toLowerCase()).not.toContain("umass");
    expect(answer.toLowerCase()).not.toMatch(/i graduated in 2024/);
    expect(answer.toLowerCase()).not.toContain("boston");
  });

  it("gym role is staff, not owner", () => {
    const { answer } = answerFromRetrieval("Are you the founder of DMV Iron Gym?");
    expect(answer.toLowerCase()).toContain("team member");
    expect(answer.toLowerCase()).toContain("leo torres williams");
    expect(answer.toLowerCase()).not.toMatch(/i am the (owner|founder|ceo)/);
  });

  it("datacenter is Akkodis assignment, not Google FTE", () => {
    const { answer } = answerFromRetrieval("Do you work at Google?");
    expect(answer.toLowerCase()).toContain("akkodis");
    expect(answer.toLowerCase()).toMatch(/not a google employee|not a google fte/);
    expect(answer.toLowerCase()).toContain("leesburg");
  });

  it("points at a real path in this repo", () => {
    const { answer } = answerFromRetrieval("Show me a project in this repo");
    expect(answer).toMatch(/Graph\/|HashMap\/|TCP\/|Flashcard_App\/|FinalProject\.sql/);
    expect(answer.toLowerCase()).toContain("github.com/jefe4/personal-projects");
  });

  it("current city is Arlington, not Rockville as home base", () => {
    const { answer } = answerFromRetrieval("Where are you based?");
    expect(answer.toLowerCase()).toContain("arlington");
  });

  it("does not list Hadoop or Keras as skills", () => {
    const { answer } = answerFromRetrieval("what are your ML skills including Hadoop Keras");
    const skillNames = profile.skills.map((s) => s.name.toLowerCase()).join(" ");
    expect(skillNames).not.toContain("hadoop");
    expect(skillNames).not.toContain("keras");
    expect(answer.toLowerCase()).not.toMatch(/i (know|use|work with) hadoop/);
  });
});
