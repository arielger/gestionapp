import { ReactNode, PropsWithoutRef } from "react"
import { z } from "src/core/zod"
import { useForm, zodResolver, UseFormReturnType, UseFormInput } from "@mantine/form"
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"

export interface FormProps<Schema extends z.ZodType<any, any>>
  // eslint-disable-next-line no-undef
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit" | "children"> {
  /** All your form fields */
  children?: (
    form: UseFormReturnType<z.TypeOf<Schema>, (values: z.TypeOf<Schema>) => z.TypeOf<Schema>>
  ) => ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: Schema
  onSubmit: (values: z.infer<Schema>) => void
  initialValues?: Partial<z.infer<Schema>>
  isLoading?: boolean
  formHookProps?: UseFormInput<z.TypeOf<Schema>>
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  isLoading = false,
  formHookProps = {},
  ...props
}: FormProps<S>) {
  const form = useForm({
    initialValues: { ...initialValues, formError: "" },
    validate: schema ? zodResolver(schema) : undefined,
    ...formHookProps,
  })

  const _onSubmit = async (values: z.TypeOf<S>) => {
    try {
      await onSubmit(values)
    } catch (error) {
      notifications.show({
        title: "Hubo un error al realizar la acción",
        message: "",
        color: "red",
        icon: <IconX />,
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit(_onSubmit)} className="form" {...props}>
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
