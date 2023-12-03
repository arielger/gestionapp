export const getContractRentPaymentDates = (startDate: Date, endDate: Date): Date[] => {
  const monthsFirstDay: Date[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    monthsFirstDay.push(new Date(currentDate))
    currentDate.setMonth(currentDate.getMonth() + 1)
    currentDate.setDate(1) // Set the day to the first day of the next month
  }

  return monthsFirstDay
}
