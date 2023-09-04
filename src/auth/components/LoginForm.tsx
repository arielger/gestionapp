import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Alert,
} from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: zodResolver(Login),
  })

  const onSubmit = async (values) => {
    try {
      const user = await loginMutation(values)
      props.onSuccess?.(user)
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        form.setErrors({ FORM_ERROR: "Las credenciales ingresadas no son correctas" })
      } else {
        form.setErrors({
          FORM_ERROR: "Hubo un error. Por favor, intenta de nuevo. " + error.toString(),
        })
      }
    }
  }

  console.log("form.errors", form.errors)

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={() => ({ fontWeight: 900 })}>
        Ingresar
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        No tienes una cuenta?{" "}
        <Anchor size="sm" component={Link} href={Routes.SignupPage()}>
          Crear cuenta
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
          <Button type="submit" fullWidth mt="xl">
            Ingresar
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginForm
