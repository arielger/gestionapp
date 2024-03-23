import type { ColumnType } from "kysely"
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

import type {
  TokenType,
  ContractFeeType,
  ContractUpdateType,
  ContractAmountUpdateStatus,
  ContractAmountUpdateType,
  ActivityType,
  ActivityPersonType,
} from "./enums"

export type Activity = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  date: Generated<Timestamp>
  organizationId: number
  amount: number
  isDebit: boolean
  type: ActivityType
  contractId: number
  assignedTo: ActivityPersonType
  paymentId: number | null
}
export type ActivityCustomDetails = {
  organizationId: number
  id: Generated<number>
  activityId: number
  title: string
}
export type ActivityRentOwnerCredit = {
  organizationId: number
  id: Generated<number>
  activityId: number
  rentDebtId: number
  rentPaymentId: number
}
export type ActivityRentPaymentDetails = {
  organizationId: number
  id: Generated<number>
  activityId: number
  rentDebtId: number
}
export type Address = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  street: string
  streetNumber: number
  subpremise: string | null
  state: string
  city: string
  postalCode: string | null
  organizationId: number
}
export type Client = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  id: Generated<number>
  firstName: string
  lastName: string
  email: string | null
  addressId: number | null
  phoneAreaCode: string | null
  phoneNumber: string | null
  identityDocNumber: number | null
}
export type Contract = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  id: Generated<number>
  propertyId: number
  startDate: Timestamp
  endDate: Timestamp
  rentAmount: number
  updateAmountType: ContractUpdateType | null
  updateAmountFrequency: number | null
  fee: number
  feeType: ContractFeeType
}
export type ContractAmountUpdate = {
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  id: Generated<number>
  contractId: number
  status: ContractAmountUpdateStatus
  updateDate: Timestamp
  indexType: ContractAmountUpdateType | null
  executedAt: Timestamp | null
  percentageVariation: number | null
  previousRentAmount: number | null
  newRentAmount: number | null
}
export type Membership = {
  id: Generated<number>
  organizationId: number
  userId: number | null
}
export type Organization = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  name: string
}
export type Payment = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  contractId: number
  organizationId: number
}
export type Property = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  id: Generated<number>
  addressId: number
}
export type PropertyOwnerOnContract = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  clientId: number
  contractId: number
}
export type PropertyOwnerOnProperty = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  clientId: number
  propertyId: number
}
export type Session = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  expiresAt: Timestamp | null
  handle: string
  hashedSessionToken: string | null
  antiCSRFToken: string | null
  publicData: string | null
  privateData: string | null
  userId: number | null
}
export type TenantOnContract = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  clientId: number
  contractId: number
}
export type Token = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  hashedToken: string
  type: TokenType
  expiresAt: Timestamp
  sentTo: string
  userId: number
}
export type User = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  name: string | null
  email: string
  hashedPassword: string | null
  role: Generated<string>
}
export type DB = {
  Activity: Activity
  ActivityCustomDetails: ActivityCustomDetails
  ActivityRentOwnerCredit: ActivityRentOwnerCredit
  ActivityRentPaymentDetails: ActivityRentPaymentDetails
  Address: Address
  Client: Client
  Contract: Contract
  ContractAmountUpdate: ContractAmountUpdate
  Membership: Membership
  Organization: Organization
  Payment: Payment
  Property: Property
  PropertyOwnerOnContract: PropertyOwnerOnContract
  PropertyOwnerOnProperty: PropertyOwnerOnProperty
  Session: Session
  TenantOnContract: TenantOnContract
  Token: Token
  User: User
}
