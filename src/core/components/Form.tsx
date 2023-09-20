import { ReactNode, PropsWithoutRef } from "react"
import { z } from "zod"
import { validateZodSchema } from "blitz"
import { useForm, zodResolver, UseFormReturnType } from "@mantine/form"
import { Button } from "@mantine/core"

export interface FormProps<Schema extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit" | "children"> {
  /** All your form fields */
  children?: (UseFormReturnType) => ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: Schema
  onSubmit: (values: z.infer<Schema>) => void
  initialValues?: z.infer<Schema>
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const form = useForm({
    initialValues,
    validate: schema ? zodResolver(schema) : undefined,
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className="form" {...props}>
      {/* Form fields supplied as children are rendered here */}
      {children?.(form)}

      {submitText && (
        <Button mt="md" type="submit">
          {submitText}
        </Button>
      )}
    </form>
  )
}

export default Form
