# Port label checker

Private tool for labeling a copper or fiber drop before it is plugged in. One drop per line:

```text
SW-A12:24 copper RK-03-U40-NIC1
SW-A12:25 fiber RK-03-U40-NIC2
```

The switch name starts with `SW-`. The port is 1 through 48. The medium is `copper` or `fiber`. The far-end label is the rack side. A switch port used twice, or a far end used twice, is an error.

## Run

```bash
node cli.mjs drops.txt
```

## Test

```bash
npm test
```
