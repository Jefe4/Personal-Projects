# Movie hash table

Custom `Hash_M` (open addressing, linear probing) used as a movie catalog. MAD hashing lives in `AbstractHashMap`; the table, tombstones, resize, and collision counters live in `Hash_M`. `Main_class` is the catalog Jeffrey originally sketched (`who` prints his name).

## What I built

- Linear probing with a DEFUNCT tombstone so deletes do not break a probe sequence.
- Resize when load would pass 0.5 (same rule as the abstract class).
- Collision / probe stats: how often the home slot was busy, longest probe, current load.
- Movie CSV loader that does not depend on `/Users/jefe/Downloads/...`.
- Commands: find / add / delete / print / stats / count / who.

This is not `java.util.HashMap` with a bow on it. The probe walk is the whole point.

## How to run

From `HashMap/`:

```bash
javac -d out src/*.java
java -cp out Main_class
java -cp out Hash_M
java -cp out Main_class --repl
```

`--repl` is the interactive catalog. Default run loads `src/movies`, prints count and collision stats, and looks up *The Shining*.

## Tests

```bash
cd HashMap
javac -d out src/*.java
java -ea -cp out Hash_MTest
```

## Complexity notes

- Average lookup is close to O(1) while load stays ≤ 0.5.
- Worst probe is O(capacity) if the table clusters — that is what `maxProbe` is for.
- Resize copies live entries into a larger odd-sized table.

Author: Jeffrey Gomez
