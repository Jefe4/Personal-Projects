import numpy as np


def _require_ndarray(*arrays):
    for arr in arrays:
        if not isinstance(arr, np.ndarray):
            raise ValueError("Inputs must be NumPy arrays.")


def _as_1d(values):
    arr = np.asarray(values, dtype=float)
    if arr.ndim == 0:
        return arr.reshape(1)
    if arr.ndim != 1:
        raise ValueError("Expected a 1D series.")
    return arr


def vector_dot_product(vec1, vec2):
    _require_ndarray(vec1, vec2)
    if vec1.ndim != 1 or vec2.ndim != 1:
        raise ValueError(
            f"Both inputs must be 1D vectors. vec1 dim: {vec1.ndim}, vec2 dim: {vec2.ndim}."
        )
    if vec1.shape[0] != vec2.shape[0]:
        raise ValueError(
            f"Incompatible shapes for dot product. vec1: {vec1.shape[0]}, vec2: {vec2.shape[0]}."
        )
    return np.dot(vec1, vec2)


def vector_elementwise_add(vec1, vec2):
    _require_ndarray(vec1, vec2)
    if vec1.shape != vec2.shape:
        raise ValueError(
            f"Incompatible shapes for element-wise addition. vec1: {vec1.shape}, vec2: {vec2.shape}."
        )
    return vec1 + vec2


def matrix_multiply(mat1, mat2):
    _require_ndarray(mat1, mat2)
    if mat1.ndim != 2 or mat2.ndim != 2:
        raise ValueError(
            f"Inputs must be 2D matrices. mat1 dim: {mat1.ndim}, mat2 dim: {mat2.ndim}."
        )
    if mat1.shape[1] != mat2.shape[0]:
        raise ValueError(
            f"Incompatible shapes for matrix multiplication. mat1 columns ({mat1.shape[1]}) must equal mat2 rows ({mat2.shape[0]})."
        )
    return np.matmul(mat1, mat2)


def sigmoid(x):
    if not isinstance(x, (np.ndarray, int, float, list)):
        raise ValueError("Input must be a NumPy array, a number (int/float), or a list.")
    arr = np.asarray(x, dtype=float)
    # Numerically stable: clip the exponent argument.
    return 1 / (1 + np.exp(-np.clip(arr, -60, 60)))


def relu(x):
    if not isinstance(x, (np.ndarray, int, float, list)):
        raise ValueError("Input must be a NumPy array, a number (int/float), or a list.")
    return np.maximum(0, np.asarray(x, dtype=float))


def pct_change(series):
    """Simple returns: (x_t - x_{t-1}) / x_{t-1}. First value is nan."""
    arr = _as_1d(series)
    out = np.empty_like(arr)
    out[0] = np.nan
    if arr.size > 1:
        prev = arr[:-1]
        out[1:] = np.where(prev == 0, np.nan, (arr[1:] - prev) / prev)
    return out


def rolling_mean(series, window):
    arr = _as_1d(series)
    if window < 1:
        raise ValueError("window must be a positive integer.")
    out = np.full(arr.shape, np.nan)
    if arr.size < window:
        return out
    csum = np.cumsum(arr)
    out[window - 1] = csum[window - 1] / window
    out[window:] = (csum[window:] - csum[:-window]) / window
    return out


def rolling_std(series, window, ddof=1):
    arr = _as_1d(series)
    if window < 2:
        raise ValueError("window must be at least 2 for a sample standard deviation.")
    out = np.full(arr.shape, np.nan)
    for i in range(window - 1, arr.size):
        chunk = arr[i - window + 1 : i + 1]
        out[i] = np.std(chunk, ddof=ddof)
    return out


def zscore(series, window=None):
    arr = _as_1d(series)
    if window is None:
        mu = np.nanmean(arr)
        sd = np.nanstd(arr, ddof=1)
        if sd == 0 or np.isnan(sd):
            return np.full(arr.shape, np.nan)
        return (arr - mu) / sd
    mean = rolling_mean(arr, window)
    std = rolling_std(arr, window)
    return np.where((std == 0) | np.isnan(std), np.nan, (arr - mean) / std)


def sharpe_ratio(returns, periods_per_year=252, risk_free=0.0):
    """Annualized Sharpe on a 1D return series. Excess return over risk_free per period."""
    arr = _as_1d(returns)
    arr = arr[np.isfinite(arr)]
    if arr.size < 2:
        return np.nan
    excess = arr - risk_free
    vol = np.std(excess, ddof=1)
    if vol == 0:
        return np.nan
    return (np.mean(excess) / vol) * np.sqrt(periods_per_year)


def max_drawdown(equity):
    """Max peak-to-trough decline of an equity curve (negative number)."""
    arr = _as_1d(equity)
    if arr.size == 0:
        return np.nan
    peaks = np.maximum.accumulate(arr)
    dd = np.where(peaks == 0, np.nan, arr / peaks - 1.0)
    return float(np.nanmin(dd))


def ols_beta(dependent, independent):
    """Simple OLS slope of dependent on independent (with intercept)."""
    y = _as_1d(dependent)
    x = _as_1d(independent)
    mask = np.isfinite(y) & np.isfinite(x)
    y, x = y[mask], x[mask]
    if y.size < 2:
        raise ValueError("Need at least two finite paired observations for OLS beta.")
    x_mean = np.mean(x)
    y_mean = np.mean(y)
    var_x = np.sum((x - x_mean) ** 2)
    if var_x == 0:
        raise ValueError("Independent series has zero variance.")
    return float(np.sum((x - x_mean) * (y - y_mean)) / var_x)


def kelly_fraction(win_prob, win_loss_ratio):
    """
    Educational Kelly fraction f* = p - (1-p)/b.

    This is a probability identity, not a betting or position-sizing system
    for live markets. Negative results are clipped to 0 in this helper.
    """
    p = float(win_prob)
    b = float(win_loss_ratio)
    if not (0 < p < 1):
        raise ValueError("win_prob must be strictly between 0 and 1.")
    if b <= 0:
        raise ValueError("win_loss_ratio must be positive.")
    return max(0.0, p - (1.0 - p) / b)


def apply_costs(returns, position, cost_bps):
    """
    Subtract round-trip-ish costs when the position changes.
    cost_bps is basis points charged on |delta position|.
    """
    ret = _as_1d(returns)
    pos = _as_1d(position)
    if ret.shape != pos.shape:
        raise ValueError("returns and position must have the same length.")
    delta = np.diff(pos, prepend=0.0)
    cost = np.abs(delta) * (cost_bps / 10000.0)
    return ret * pos - cost


if __name__ == "__main__":
    print("--- ML Math Toolkit Examples ---")

    v1 = np.array([1, 2, 3])
    v2 = np.array([4, 5, 6])
    print(f"\nVector v1: {v1}")
    print(f"Vector v2: {v2}")
    print(f"Dot product of v1 and v2: {vector_dot_product(v1, v2)}")
    print(f"Element-wise addition of v1 and v2: {vector_elementwise_add(v1, v2)}")

    m1 = np.array([[1, 2], [3, 4]])
    m2 = np.array([[5, 6], [7, 8]])
    print(f"\nMatrix multiplication of m1 and m2:\n{matrix_multiply(m1, m2)}")

    scalar_val = 0.5
    list_vals = [-10.0, -0.5, 0.0, 0.5, 10.0]
    array_vals = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])
    print(f"\nSigmoid of scalar {scalar_val}: {sigmoid(scalar_val)}")
    print(f"ReLU of scalar {scalar_val}: {relu(scalar_val)}")
    print(f"Sigmoid of list {list_vals}: {sigmoid(list_vals)}")
    print(f"ReLU of array {array_vals}: {relu(array_vals)}")
    print(f"Sigmoid of large negative (stability): {sigmoid(-1000)}")

    prices = np.array([100.0, 101.0, 99.0, 102.0, 103.0])
    rets = pct_change(prices)
    print(f"\nSimple returns: {rets}")
    print(f"Z-score: {zscore(prices)}")
    equity = np.cumprod(1 + np.nan_to_num(rets, nan=0.0))
    print(f"Sharpe (toy, 5 obs): {sharpe_ratio(rets)}")
    print(f"Max drawdown: {max_drawdown(equity)}")
    print(f"OLS beta of prices vs arange: {ols_beta(prices, np.arange(len(prices)))}")
    print(f"Kelly fraction p=0.55, b=1: {kelly_fraction(0.55, 1.0)}")

    print("\n--- Error Handling Examples ---")
    try:
        vector_dot_product(v1, np.array([1, 2]))
    except ValueError as exc:
        print(f"Expected error: {exc}")
    try:
        matrix_multiply(np.array([[1, 2, 3], [4, 5, 6]]), m1)
    except ValueError as exc:
        print(f"Expected error: {exc}")
    try:
        sigmoid("test_string")
    except ValueError as exc:
        print(f"Expected error: {exc}")
