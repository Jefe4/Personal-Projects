"""Offline paper-research demo on synthetic OHLCV.

Compares always-long vs a z-score fade rule, with and without costs,
plus a tiny walk-forward split. Education only — not a trading system.
"""
from __future__ import annotations

import csv
from pathlib import Path

import numpy as np

from ml_math_toolkit import (
    apply_costs,
    max_drawdown,
    pct_change,
    sharpe_ratio,
    zscore,
)

DATA = Path(__file__).resolve().parent / "data" / "synthetic_ohlcv.csv"
COST_BPS = 10.0
Z_WINDOW = 20
Z_ENTRY = 1.0


def load_closes(path=DATA):
    dates, closes = [], []
    with path.open() as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            dates.append(row["date"])
            closes.append(float(row["close"]))
    return dates, np.array(closes, dtype=float)


def metrics(name, rets):
    equity = np.cumprod(1 + np.nan_to_num(rets, nan=0.0))
    finite = rets[np.isfinite(rets)]
    hit = float(np.mean(finite > 0)) if finite.size else float("nan")
    return {
        "name": name,
        "sharpe": sharpe_ratio(rets),
        "max_dd": max_drawdown(equity),
        "end_equity": float(equity[-1]),
        "hit_rate": hit,
        "n": int(np.isfinite(rets).sum()),
    }


def format_row(m):
    return (
        f"{m['name']:28s}  Sharpe={m['sharpe']:7.3f}  "
        f"MaxDD={m['max_dd']:7.3f}  Equity={m['end_equity']:6.3f}  "
        f"Hit={m['hit_rate']:5.2%}  n={m['n']}"
    )


def zscore_position(closes):
    z = zscore(closes, Z_WINDOW)
    # Fade: long when cheap, short when rich, else flat. Toy rule only.
    pos = np.zeros_like(closes)
    pos[z < -Z_ENTRY] = 1.0
    pos[z > Z_ENTRY] = -1.0
    pos[~np.isfinite(z)] = 0.0
    return pos


def walk_forward(returns, position, folds=3):
    n = len(returns)
    fold = n // folds
    rows = []
    for i in range(folds):
        start = i * fold
        end = n if i == folds - 1 else (i + 1) * fold
        r = apply_costs(returns[start:end], position[start:end], COST_BPS)
        rows.append(metrics(f"walk-forward fold {i + 1}", r))
    return rows


def main():
    print("Paper research demo — synthetic series, not live markets.\n")
    dates, closes = load_closes()
    rets = pct_change(closes)
    rets[0] = 0.0

    long_pos = np.ones_like(closes)
    long_raw = apply_costs(rets, long_pos, 0.0)
    long_cost = apply_costs(rets, long_pos, COST_BPS)
    # Always-long only pays cost on the initial entry.
    z_pos = zscore_position(closes)
    z_raw = apply_costs(rets, z_pos, 0.0)
    z_cost = apply_costs(rets, z_pos, COST_BPS)

    print(format_row(metrics("always-long (0 bps)", long_raw)))
    print(format_row(metrics(f"always-long ({COST_BPS:.0f} bps)", long_cost)))
    print(format_row(metrics("z-score fade (0 bps)", z_raw)))
    print(format_row(metrics(f"z-score fade ({COST_BPS:.0f} bps)", z_cost)))
    print()
    print("Walk-forward on the z-score rule with costs (same rule, sequential windows):")
    for row in walk_forward(rets, z_pos):
        print("  " + format_row(row))
    print()
    print(f"Bars: {len(dates)} from {dates[0]} to {dates[-1]}")
    print("Costs change turnover-heavy rules more than buy-and-hold.")
    print("A single in-sample Sharpe is not evidence. This is a teaching loop, not an edge.")


if __name__ == "__main__":
    main()
