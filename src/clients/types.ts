import { Prisma } from "@prisma/client"
import { Optional } from "src/core/types"

export const clientWithAddressInclude = { address: true }

export type ClientWithAddress = Prisma.ClientGetPayload<{
  include: typeof clientWithAddressInclude
}>

export type ClientWithOptionalAddress = Optional<ClientWithAddress, "address">
