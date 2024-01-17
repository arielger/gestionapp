export const getPorcentageProgressFromRange = (start: Date, end: Date) => {
  const total = end.getTime() - start.getTime()
  const current = Date.now() - start.getTime()
  return (current * 100) / total
}
