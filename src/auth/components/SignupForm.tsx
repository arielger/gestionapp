import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Alert,
} from "@mantine/core"
import { useMutation } from "@blitzjs/rpc"
import { useForm, zodResolver } from "@mantine/form"

import { FORM_ERROR } from "src/core/components/FinalFormForm"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation, { isLoading }] = useMutation(signup)

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: zodResolver(Signup),
  })

  const onSubmit = async (values) => {
    try {
      await signupMutation(values)
      props.onSuccess?.()
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        // This error comes from Prisma
        form.setErrors({ email: "El email ingresado ya esta en uso" })
      } else {
        form.setErrors({ [FORM_ERROR]: `Hubo un error creando tu cuenta. ${error.toString()}` })
      }
    }
  }

  return (
    <Container size={420} my={40}>
      <Title style={{ textAlign: "center" }} fw="bold">
        Crear cuenta
      </Title>
      <Text c="dimmed" size="sm" style={{ textAlign: "center" }} mt={5}>
        Ya tienes una cuenta?{" "}
        <Anchor size="sm" component={Link} href={Routes.LoginPage()}>
          Ingresar
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput label="Email" {...form.getInputProps("email")} required />
          <PasswordInput label="Contraseña" {...form.getInputProps("password")} required mt="md" />
          {form.errors.FORM_ERROR && (
            <Alert color="red" mt={16}>
              {form.errors.FORM_ERROR}
            </Alert>
          )}
          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Crear cuenta
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
