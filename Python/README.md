# Python Scripts for Utility and AI/ML Concepts

Intro exercises plus a small paper-research math toolkit. Nothing here places trades or uses live market data.

## Paper research (`ml_math_toolkit.py`, `paper_research_demo.py`)

`ml_math_toolkit.py` has vector/matrix helpers, stable sigmoid/ReLU, and returns/risk functions: `pct_change`, rolling mean/std, `zscore`, Sharpe, max drawdown, OLS beta, and an **educational** Kelly fraction.

`paper_research_demo.py` loads committed synthetic OHLCV (`data/synthetic_ohlcv.csv`, seed 42) and compares always-long vs a toy z-score fade **with and without 10 bps costs**, then a 3-fold walk-forward. The fade rule is expected to look worse after costs — that is the lesson.

Regenerate CSVs (OHLCV + `Java/ArrayList/src/knn_regime.csv`):

```bash
pip install -r requirements.txt
python generate_synthetic_data.py
python paper_research_demo.py
python ml_math_toolkit.py
```

## Other scripts

* `functions.py` — intro function drills (area input, averages, divisibility).
* `string_slicing.py` — string drills; related to NLP tokenization only at a conceptual level.
* `Calculate_area.py` — circle area/circumference; accepts floats.

Education only. Not investment advice.
