import { ReactNode, PropsWithoutRef } from "react"
import { z } from "zod"
import { useForm, zodResolver, UseFormReturnType } from "@mantine/form"
import { Button } from "@mantine/core"

export interface FormProps<Schema extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit" | "children"> {
  /** All your form fields */
  children?: (
    form: UseFormReturnType<z.TypeOf<Schema>, (values: z.TypeOf<Schema>) => z.TypeOf<Schema>>
  ) => ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: Schema
  onSubmit: (values: z.infer<Schema>) => void
  initialValues?: z.infer<Schema>
  isLoading?: boolean
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  isLoading = false,
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
        <Button mt="md" type="submit" loading={isLoading}>
          {submitText}
        </Button>
      )}
    </form>
  )
}

export default Form
