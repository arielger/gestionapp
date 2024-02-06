import { Contract } from "@prisma/client"

export const getContractRentPaymentDates = (startDate: Date, endDate: Date): Date[] => {
  const monthsFirstDay: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    monthsFirstDay.push(new Date(currentDate))
    currentDate.setMonth(currentDate.getMonth() + 1)
    currentDate.setDate(1) // Set the day to the first day of the next month
  }

  return monthsFirstDay
}

// get any contract that is not finished yet (might be not started or in progress)
export const getCurrentContract = <CustomContract extends Contract>(
  contracts: CustomContract[]
) => {
  return contracts?.find((contract) => contract.endDate > new Date())
}
