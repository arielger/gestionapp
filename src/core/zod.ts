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

// we can't map over an array of literals because it's not a valid type
// so we need this helper
// reference: https://stackoverflow.com/a/74921781/3424328
export const oneOf = <T extends string | number | boolean | bigint | null | undefined>(
  t: readonly [T, T, ...T[]]
) => {
  // A union must have at least 2 elements so to work with the types it
  // must be instantiated in this way.
  return z.union([
    z.literal(t[0]),
    z.literal(t[1]),
    // No pointfree here because `z.literal` takes an optional second parameter
    ...t.slice(2).map((v) => z.literal(v)),
  ])
}

export { z }
