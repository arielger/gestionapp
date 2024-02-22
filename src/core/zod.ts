import i18next from "i18next"
import { z } from "zod"
import { zodI18nMap } from "zod-i18n-map"
import esZodTranslation from "zod-i18n-map/locales/es/zod.json"

void i18next.init({
  lng: "es",
  resources: {
    es: { zod: esZodTranslation },
  },
})
z.setErrorMap(zodI18nMap)

export const zodEmptyValueToUndefined = <T extends z.ZodTypeAny>(zodType: T) => {
  return z.preprocess((val) => (val === "" || val === undefined ? undefined : val), zodType)
}

/** Check that string has any content */
export const zodNonEmptyStringValidation = z
  .string()
  .trim()
  .min(1, esZodTranslation.errors.invalid_type_received_undefined)

export { z }
