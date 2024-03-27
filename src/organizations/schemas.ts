import { zodNonEmptyStringValidation } from "src/core/zod"
import { z } from "zod"

export const UpdateOrganizationSchema = z.object({
  name: zodNonEmptyStringValidation,
})
