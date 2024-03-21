import axios from "axios"
import { format as formatDate, subMonths } from "date-fns"

export const ARG_IPC_API =
  "https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=5000&format=json"

type IpcMonthAndValue = [string, number] // ["2018-03-01", "133.1054"]

// TO REVIEW: should we save this in the database?
export const getIpcValues = async () => {
  try {
    const response = await axios.get(ARG_IPC_API)
    const values: IpcMonthAndValue[] = response.data.data
    return values
  } catch (error) {
    throw new Error("IPC API not available.")
  }
}

const getIpcValueByMonth = (ipcValues: IpcMonthAndValue[], date: Date) => {
  const formattedDate = formatDate(date, "yyyy-MM-dd")
  return ipcValues.find(([ipcMonth]) => ipcMonth === formattedDate)?.[1]
}

/** Get IPC values based on update date and frequency and then calculate the rate to update the activities amount
 */
export const getIpcRate = ({
  ipcValues,
  updateDate,
  rangeMonths,
}: {
  ipcValues: IpcMonthAndValue[]
  updateDate: Date
  rangeMonths: number
}) => {
  const previousMonthIpc = getIpcValueByMonth(ipcValues, subMonths(updateDate, 1))

  let ipcStartValue: number | undefined
  let ipcEndValue: number | undefined

  /*
   * Current month index might not be available (IPC of one month is uploaded in the middle of the next month) ->
   * in that case, we move the range one month earlier
   */
  if (previousMonthIpc) {
    ipcStartValue = getIpcValueByMonth(ipcValues, subMonths(updateDate, rangeMonths + 1))
    ipcEndValue = previousMonthIpc
  } else {
    ipcStartValue = getIpcValueByMonth(ipcValues, subMonths(updateDate, rangeMonths + 2))
    ipcEndValue = getIpcValueByMonth(ipcValues, subMonths(updateDate, 2))
  }

  if (!ipcStartValue) {
    throw new Error(`Index (IPC) value not found for first item of range: ${ipcStartValue}`)
  }

  if (!ipcEndValue) {
    throw new Error(`Index (IPC) value not found for last item of range: ${ipcEndValue}`)
  }

  return ipcEndValue / ipcStartValue
}
