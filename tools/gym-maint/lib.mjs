/**
 * Local gym-equipment maintenance tracker.
 * Dates are YYYY-MM-DD. "Due" means the last service plus the interval
 * is on or before the day you ask about. Never-serviced gear is due.
 */

export function addDays(iso, days) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error("date must be YYYY-MM-DD");
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function emptyDb() {
  return { equipment: [] };
}

export function addEquipment(db, item) {
  if (!item.id || !item.name) throw new Error("id and name are required");
  if (!Number.isInteger(item.everyDays) || item.everyDays < 1) throw new Error("everyDays must be a positive integer");
  if (db.equipment.some((piece) => piece.id === item.id)) throw new Error(`duplicate id ${item.id}`);
  const next = {
    equipment: [
      ...db.equipment,
      {
        id: item.id,
        name: item.name,
        everyDays: item.everyDays,
        lastService: item.lastService || null,
        note: item.note || "",
      },
    ],
  };
  return next;
}

export function markServiced(db, id, on, note) {
  addDays(on, 0);
  const found = db.equipment.find((piece) => piece.id === id);
  if (!found) throw new Error(`unknown id ${id}`);
  return {
    equipment: db.equipment.map((piece) =>
      piece.id === id ? { ...piece, lastService: on, note: note ?? piece.note } : piece,
    ),
  };
}

export function dueOn(db, on) {
  addDays(on, 0);
  return db.equipment
    .filter((piece) => {
      if (!piece.lastService) return true;
      return addDays(piece.lastService, piece.everyDays) <= on;
    })
    .map((piece) => ({
      id: piece.id,
      name: piece.name,
      lastService: piece.lastService,
      due: piece.lastService ? addDays(piece.lastService, piece.everyDays) : on,
    }));
}
