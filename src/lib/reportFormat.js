export function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(Number(n) || 0)
}

export function formatPercent(n) {
  const v = Number(n)
  return `${Number.isFinite(v) ? v.toFixed(2) : '0.00'}%`
}
