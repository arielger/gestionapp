import { ContractUpdateType } from "@prisma/client"

export const updateAmountFrequency = [1, 2, 3, 4, 6, 9, 12] as const

export const updateIndexToString: Record<ContractUpdateType, string> = {
  INDEX_IPC: "IPC (Indice de precios al consumidor)",
}

export const indexUpdateFrequencyToString: Record<(typeof updateAmountFrequency)[number], string> =
  {
    1: "Mensual",
    2: "Bimestral",
    3: "Trimestral",
    4: "Cuatrimestral",
    6: "Semestral",
    9: "cada 9 meses",
    12: "Anual",
  }
