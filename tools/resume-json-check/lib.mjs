/**
 * Hard-fact checks for the resume JSON the recruiter site reads.
 * A passing file must keep the Aug 27, 2026 facts:
 * Akkodis contractor (not a Google employee), DMV Iron Gym staff
 * (not the owner), Frostburg still enrolled, Westat, Rockville HS.
 */

function job(data, org) {
  return (data.experience || []).find((item) => item.org === org);
}

export function checkResume(data) {
  const errors = [];
  if (!data || typeof data !== "object") return { ok: false, errors: ["resume must be an object"] };

  const id = data.identity || {};
  if (!/arlington/i.test(id.location || "")) errors.push("location must name Arlington");
  const languages = id.languages || [];
  if (!languages.includes("English") || !languages.includes("Spanish")) {
    errors.push("languages must include English and Spanish");
  }
  if (!/github\.com\/Jefe4\b/i.test(id.github || "")) errors.push("github must be https://github.com/Jefe4");

  const akkodis = job(data, "Akkodis");
  if (!akkodis) errors.push("missing Akkodis");
  else {
    if (akkodis.title !== "Datacenter Technician") errors.push("Akkodis title must be Datacenter Technician");
    if (!/leesburg/i.test(akkodis.location || "")) errors.push("Akkodis location must be Leesburg, VA");
    if (akkodis.start !== "Sep 2025" || !/present/i.test(akkodis.end || "")) {
      errors.push("Akkodis dates must be Sep 2025 to present");
    }
    const note = `${akkodis.assignment || ""} ${(akkodis.titleNote || "")}`.toLowerCase();
    if (!/contractor/.test(note) || !/not a google/.test(note)) {
      errors.push("Akkodis assignment must say contractor and not a Google employee");
    }
    if (/google employee|google fte/i.test(akkodis.title || "")) errors.push("Akkodis title must not be a Google role");
  }

  const gym = (data.experience || []).find((item) => /iron gym/i.test(item.org || ""));
  if (!gym) errors.push("missing DMV Iron Gym");
  else {
    if (!/team member/i.test(gym.title || "") || !/systems administrator/i.test(gym.title || "")) {
      errors.push("gym title must be Team Member & Systems Administrator");
    }
    if (!/falls church/i.test(gym.location || "")) errors.push("gym location must be Falls Church");
    if (gym.start !== "Jul 2024" || !/present/i.test(gym.end || "")) errors.push("gym dates must be Jul 2024 to present");
    const owner = `${gym.owner || ""} ${gym.titleNote || ""}`;
    if (!/leo torres williams/i.test(owner)) errors.push("gym record must name owner Leo Torres Williams");
    if (!/not owner|not the owner|staff/i.test(owner)) errors.push("gym record must say Jeffrey is staff, not the owner");
    if (/^(owner|founder|ceo)\b/i.test(gym.title || "")) errors.push("gym title must not be owner, founder, or CEO");
  }

  const westat = job(data, "Westat");
  if (!westat) errors.push("missing Westat");
  else {
    if (westat.title !== "Technical Data Entry Clerk") errors.push("Westat title must be Technical Data Entry Clerk");
    if (!/rockville/i.test(westat.location || "")) errors.push("Westat location must be Rockville");
    if (westat.start !== "Jun 2023" || westat.end !== "Oct 2023") errors.push("Westat dates must be Jun 2023 to Oct 2023");
  }

  const school = (data.education || []).find((item) => /frostburg/i.test(item.school || ""));
  if (!school) errors.push("missing Frostburg State");
  else {
    if (school.status !== "enrolled") errors.push("Frostburg status must be enrolled");
    if (!/2027/.test(`${school.expected || ""} ${school.line || ""}`)) errors.push("Frostburg must be expected June 2027");
    if (/graduated|conferred|alumni/i.test(school.status || "")) errors.push("Frostburg must not be marked graduated");
  }

  const highSchool = (data.education || []).find((item) => /rockville high/i.test(item.school || ""));
  if (!highSchool || !/2019/.test(highSchool.graduated || "")) errors.push("Rockville High School diploma must be 2019");

  const banned = (data.doNotClaim || []).join(" ").toLowerCase();
  if (!banned.includes("google")) errors.push("doNotClaim must mention Google employee");
  if (!banned.includes("owner") && !banned.includes("founder")) errors.push("doNotClaim must mention gym owner or founder");
  if (!banned.includes("bachelor") && !banned.includes("degree")) errors.push("doNotClaim must mention the degree is not completed");

  return { ok: errors.length === 0, errors };
}
