/**
 * Datacenter rack / asset label checker.
 * One record per line:
 *   SITE-HALL-ROW-RACK-U## AST-########
 * Example: IAD-H1-A-12-U24 AST-00018421
 *
 * This is a floor-label convention for a technician's own checklist.
 * It is not a vendor or employer asset schema.
 */

const SLOT = /^([A-Z]{3})-H(\d+)-([A-Z])-(\d{1,2})-U(\d{1,2})$/;
const ASSET = /^AST-\d{8}$/;

export function parseSlot(slot) {
  const match = String(slot).trim().match(SLOT);
  if (!match) return null;
  return {
    site: match[1],
    hall: Number(match[2]),
    row: match[3],
    rack: Number(match[4]),
    u: Number(match[5]),
  };
}

export function checkLabels(text) {
  const issues = [];
  const seenSlot = new Map();
  const seenAsset = new Map();
  const records = [];
  const lines = String(text).split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith("#")) continue;
    const line = i + 1;
    const [slotText, asset, extra] = raw.split(/\s+/);
    const slot = parseSlot(slotText);

    if (!slot) {
      issues.push({ line, code: "slot-format", detail: slotText });
    } else if (slot.u < 1 || slot.u > 42) {
      issues.push({ line, code: "u-range", detail: String(slot.u) });
    } else if (seenSlot.has(slotText)) {
      issues.push({ line, code: "duplicate-slot", detail: `${slotText} also on line ${seenSlot.get(slotText)}` });
    } else {
      seenSlot.set(slotText, line);
    }

    if (!asset || !ASSET.test(asset)) {
      issues.push({ line, code: "asset-format", detail: asset || "(missing)" });
    } else if (seenAsset.has(asset)) {
      issues.push({ line, code: "duplicate-asset", detail: `${asset} also on line ${seenAsset.get(asset)}` });
    } else {
      seenAsset.set(asset, line);
    }

    if (extra) issues.push({ line, code: "extra-field", detail: extra });
    records.push({ line, slot, asset: asset || null });
  }

  return { ok: issues.length === 0, records, issues };
}
