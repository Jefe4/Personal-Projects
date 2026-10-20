# Rack and asset label checker

Private tool for a datacenter floor checklist. Each line is one installed position:

```text
IAD-H1-A-12-U24 AST-00018421
```

- Site is three letters (`IAD`).
- Hall is `H` plus a number.
- Row is one letter.
- Rack is 1 or 2 digits.
- U is `U` plus a position from 1 through 42.
- Asset tag is `AST-` plus 8 digits.

Blank lines and lines starting with `#` are skipped. The checker reports a bad format, a U outside 1–42, a repeated slot, a repeated asset tag, and an extra field.

This format is a personal checklist. It is not an employer or Google asset schema.

## Run

```bash
node cli.mjs labels.txt
```

Exit code is 1 when any issue is found.

## Test

```bash
npm test
```
