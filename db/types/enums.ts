export const TokenType = {
  RESET_PASSWORD: "RESET_PASSWORD",
} as const
export type TokenType = (typeof TokenType)[keyof typeof TokenType]
export const ContractFeeType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const
export type ContractFeeType = (typeof ContractFeeType)[keyof typeof ContractFeeType]
export const ActivityType = {
  RENT: "RENT",
  RENT_FEE: "RENT_FEE",
  CUSTOM: "CUSTOM",
} as const
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]
export const ActivityPersonType = {
  OWNER: "OWNER",
  TENANT: "TENANT",
} as const
export type ActivityPersonType = (typeof ActivityPersonType)[keyof typeof ActivityPersonType]
