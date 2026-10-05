"""Generate in-repo synthetic OHLCV and a time-ordered k-NN feature CSV.

Education / paper research only. Seed is fixed so the files can be committed.
"""
from __future__ import annotations

import csv
from datetime import date, timedelta
from pathlib import Path

import numpy as np

from ml_math_toolkit import pct_change, rolling_std, zscore

SEED = 42
N_DAYS = 504
ROOT = Path(__file__).resolve().parent
OHLCV_PATH = ROOT / "data" / "synthetic_ohlcv.csv"
KNN_PATH = ROOT.parent / "Java" / "ArrayList" / "src" / "knn_regime.csv"


def geometric_brownian_prices(n, seed=SEED, start=100.0, mu=0.00015, sigma=0.012):
    rng = np.random.default_rng(seed)
    shocks = rng.normal(mu, sigma, size=n)
    log_prices = np.log(start) + np.cumsum(shocks)
    return np.exp(log_prices)


def build_ohlcv(n=N_DAYS):
    close = geometric_brownian_prices(n)
    rng = np.random.default_rng(SEED + 1)
    open_px = np.concatenate([[close[0]], close[:-1]])
    noise = rng.uniform(0.001, 0.006, size=n)
    high = np.maximum(open_px, close) * (1 + noise)
    low = np.minimum(open_px, close) * (1 - noise)
    volume = rng.integers(800_000, 2_400_000, size=n)
    start = date(2018, 1, 2)
    rows = []
    d = start
    for i in range(n):
        while d.weekday() >= 5:
            d += timedelta(days=1)
        rows.append(
            {
                "date": d.isoformat(),
                "open": round(float(open_px[i]), 4),
                "high": round(float(high[i]), 4),
                "low": round(float(low[i]), 4),
                "close": round(float(close[i]), 4),
                "volume": int(volume[i]),
            }
        )
        d += timedelta(days=1)
    return rows


def write_ohlcv(rows, path=OHLCV_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["date", "open", "high", "low", "close", "volume"])
        writer.writeheader()
        writer.writerows(rows)
    return path


def build_knn_rows(rows, lookback=20):
    close = np.array([r["close"] for r in rows], dtype=float)
    ret1 = pct_change(close)
    vol = rolling_std(ret1, lookback)
    z = zscore(close, lookback)
    fwd = np.empty_like(ret1)
    fwd[:-1] = ret1[1:]
    fwd[-1] = np.nan

    out = []
    for i in range(len(rows) - 1):
        if i < lookback:
            continue
        if not np.isfinite([ret1[i], vol[i], z[i], fwd[i]]).all():
            continue
        if fwd[i] > 0.002:
            label = "UP"
        elif fwd[i] < -0.002:
            label = "DOWN"
        else:
            label = "FLAT"
        out.append(
            [
                f"{ret1[i]:.6f}",
                f"{vol[i]:.6f}",
                f"{z[i]:.6f}",
                label,
            ]
        )
    return out


def write_knn(rows, path=KNN_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as handle:
        handle.write("# ret_1d,vol_20,z_close,next_bar_label  (synthetic, chronological)\n")
        writer = csv.writer(handle)
        writer.writerows(rows)
    return path


def main():
    ohlcv = build_ohlcv()
    ohlcv_path = write_ohlcv(ohlcv)
    knn_rows = build_knn_rows(ohlcv)
    knn_path = write_knn(knn_rows)
    print(f"Wrote {len(ohlcv)} bars to {ohlcv_path}")
    print(f"Wrote {len(knn_rows)} labeled feature rows to {knn_path}")
    print("Seed:", SEED)
    print("Education / paper research only. Not market data and not investment advice.")


if __name__ == "__main__":
    main()
