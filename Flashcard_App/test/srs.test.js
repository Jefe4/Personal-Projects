const assert = require("assert");
const { nextInterval } = require("../server.js");

let miss = nextInterval(3, false);
assert.strictEqual(miss.box, 1);
assert.strictEqual(miss.days, 0);

let hit = nextInterval(1, true);
assert.strictEqual(hit.box, 2);
assert.strictEqual(hit.days, 1);

let later = nextInterval(4, true);
assert.strictEqual(later.box, 5);
assert.ok(later.days >= 7);

console.log("srs.test.js ok");
