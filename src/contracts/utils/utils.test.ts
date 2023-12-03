import { getContractRentPaymentDates } from "./utils"

describe("getContractRentPaymentDates", () => {
  it("should return all starting dates for all months of the year", () => {
    const result = getContractRentPaymentDates(
      new Date("2023-01-01T00:00:00"),
      new Date("2023-12-31T00:00:00")
    )
    expect(result).toStrictEqual([
      new Date("2023-01-01T03:00:00.000Z"),
      new Date("2023-02-01T03:00:00.000Z"),
      new Date("2023-03-01T03:00:00.000Z"),
      new Date("2023-04-01T03:00:00.000Z"),
      new Date("2023-05-01T03:00:00.000Z"),
      new Date("2023-06-01T03:00:00.000Z"),
      new Date("2023-07-01T03:00:00.000Z"),
      new Date("2023-08-01T03:00:00.000Z"),
      new Date("2023-09-01T03:00:00.000Z"),
      new Date("2023-10-01T03:00:00.000Z"),
      new Date("2023-11-01T03:00:00.000Z"),
      new Date("2023-12-01T03:00:00.000Z"),
    ])
  })

  it("should return the start date as first element (not the start date of the month)", () => {
    const result = getContractRentPaymentDates(
      new Date("2023-01-15T00:00:00"),
      new Date("2023-03-31T00:00:00")
    )
    expect(result).toStrictEqual([
      // start date should be the same as the start date
      new Date("2023-01-15T03:00:00.000Z"),
      new Date("2023-02-01T03:00:00.000Z"),
      new Date("2023-03-01T03:00:00.000Z"),
    ])
  })

  it("should work when period is bigger than a year", () => {
    const result = getContractRentPaymentDates(
      new Date("2023-09-01T00:00:00"),
      new Date("2024-03-31T00:00:00")
    )
    expect(result).toStrictEqual([
      new Date("2023-09-01T03:00:00.000Z"),
      new Date("2023-10-01T03:00:00.000Z"),
      new Date("2023-11-01T03:00:00.000Z"),
      new Date("2023-12-01T03:00:00.000Z"),
      new Date("2024-01-01T03:00:00.000Z"),
      new Date("2024-02-01T03:00:00.000Z"),
      new Date("2024-03-01T03:00:00.000Z"),
    ])
  })
})
