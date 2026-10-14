# ESP32 serial log parser

Private tool. It reads an ESP32 serial-monitor capture and prints resets, boot banners, ESP-IDF log lines, dispense-style state changes (`state IDLE -> ARM`), errors, and panics.

This parser is not a copy of the dispenser firmware. The firmware repository was not readable from the site checkout, so the grammar here is the public ESP-IDF / ROM line format a technician already sees in a serial monitor.

## Run

```bash
node cli.mjs capture.txt
```

Exit code is 1 when the log contains an error or a panic, and 0 when it does not. The JSON goes to stdout.

## Test

```bash
npm test
```

## Log lines it understands

- `ets ...` and `ESP-ROM:` boot banners
- `rst:0x1 (POWERON_RESET),boot:...`
- `I (320) tag: message` and the same shape for `W` and `E`
- `state FROM -> TO` inside a log message
- `Guru Meditation Error` and `panic'ed`
