import { Body, Container, Head, Html, Preview, Heading, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"
import * as React from "react"

type PaymentReceiptEmailProps = {
  id: number
  createdAt: Date
  propertyAddress: string
}

export const PaymentReceiptEmail = ({
  id,
  createdAt,
  propertyAddress,
}: PaymentReceiptEmailProps) => {
  return (
    <Html lang="es">
      <Head />
      <Preview>
        Registramos tu pago exitosamente. Ingresa al email para descargar el recibo.
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading>Registramos tu pago exitosamente</Heading>
            <Text>
              Tu pago #{id} se registró correctamente. Te dejamos los detalles del mismo y el recibo
              adjunto.
            </Text>
            <Text>Fecha: {createdAt.toLocaleDateString()}</Text>
            <Text>Propiedad: {propertyAddress}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

PaymentReceiptEmail.PreviewProps = {
  id: 651,
  createdAt: new Date(),
  propertyAddress: "Calle Falsa 123, Villa Crespo, CABA",
} satisfies PaymentReceiptEmailProps

export default PaymentReceiptEmail
