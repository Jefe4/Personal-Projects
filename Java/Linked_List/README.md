# Linked list drills

Small integer-chain programs, written the way the original files were written: a node with `num` and `next`.

- `Traverse.java` — walk a chain, print True/False if a value is there.
- `swap.java` / `add.java` / `Iterator.java` — earlier drills using `java.util.LinkedList`.
- `IntChain.java` — the same node idea, with contains / swap / sorted insert in one place so it can be tested.

## Run

```bash
cd Java/Linked_List
javac -d out *.java
java -cp out Traverse
java -cp out IntChain
java -ea -cp out IntChainTest
```

Contains is O(n). Sorted insert is O(n). No extra libraries.
