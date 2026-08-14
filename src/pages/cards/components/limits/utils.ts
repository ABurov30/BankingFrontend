export function getLimitValue(value?: number) {
  return value ?? 0
}

export function getLimitUsageWidth(spent?: number, limit?: number) {
  const limitValue = getLimitValue(limit)

  if (limitValue <= 0) {
    return '0%'
  }

  const spentValue = Math.max(0, spent ?? 0)
  const percent = Math.min((spentValue / limitValue) * 100, 100)

  return `${percent}%`
}
