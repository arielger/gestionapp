export const TokenType = {
  RESET_PASSWORD: "RESET_PASSWORD",
} as const
export type TokenType = (typeof TokenType)[keyof typeof TokenType]
export const ContractFeeType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const
export type ContractFeeType = (typeof ContractFeeType)[keyof typeof ContractFeeType]
export const ContractUpdateType = {
  INDEX_IPC: "INDEX_IPC",
} as const
export type ContractUpdateType = (typeof ContractUpdateType)[keyof typeof ContractUpdateType]
export const ContractAmountUpdateStatus = {
  INITIAL: "INITIAL",
  EXECUTED_WITH_PROVISIONAL_INDEX: "EXECUTED_WITH_PROVISIONAL_INDEX",
  EXECUTED: "EXECUTED",
} as const
export type ContractAmountUpdateStatus =
  (typeof ContractAmountUpdateStatus)[keyof typeof ContractAmountUpdateStatus]
export const ActivityType = {
  RENT_DEBT: "RENT_DEBT",
  RENT_PAYMENT: "RENT_PAYMENT",
  RENT_OWNER_CREDIT: "RENT_OWNER_CREDIT",
  CUSTOM: "CUSTOM",
} as const
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]
export const ActivityPersonType = {
  OWNER: "OWNER",
  TENANT: "TENANT",
} as const
export type ActivityPersonType = (typeof ActivityPersonType)[keyof typeof ActivityPersonType]
