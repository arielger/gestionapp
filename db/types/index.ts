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
export type Contract = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  propertyId: number
  organizationId: number
  startDate: Timestamp
  endDate: Timestamp
  rentAmount: number
  fee: number
  feeType: ContractFeeType
}
export type ContractToRealStateOwner = {
  A: number
  B: number
}
export type ContractToTenant = {
  A: number
  B: number
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
  id: Generated<number>
  address: string
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  organizationId: number
}
export type PropertyToRealStateOwner = {
  A: number
  B: number
}
export type RealStateOwner = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  firstName: string
  lastName: string
  organizationId: number
  email: string | null
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
export type Tenant = {
  id: Generated<number>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  firstName: string
  lastName: string
  organizationId: number
  email: string | null
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
  _ContractToRealStateOwner: ContractToRealStateOwner
  _ContractToTenant: ContractToTenant
  _PropertyToRealStateOwner: PropertyToRealStateOwner
  Activity: Activity
  ActivityCustomDetails: ActivityCustomDetails
  Contract: Contract
  Membership: Membership
  Organization: Organization
  Payment: Payment
  Property: Property
  RealStateOwner: RealStateOwner
  Session: Session
  Tenant: Tenant
  Token: Token
  User: User
}
