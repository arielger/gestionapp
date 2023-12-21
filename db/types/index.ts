import type { ColumnType } from "kysely"
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

import type { TokenType, ContractFeeType, ActivityType, ActivityPersonType } from "./enums"

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
  customDetailsId: number | null
  paymentId: number | null
  originActivityId: number | null
}
export type ActivityCustomDetails = {
  id: Generated<number>
  activityId: number
  title: string
}
export type Client = {
  organizationId: number
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  id: Generated<number>
  firstName: string
  lastName: string
  email: string | null
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
  fee: number
  feeType: ContractFeeType
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
  address: string
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
  Client: Client
  Contract: Contract
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
