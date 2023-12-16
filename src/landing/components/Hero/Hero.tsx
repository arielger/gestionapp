import { Title, Text, Button, Container } from "@mantine/core"
import { Dots } from "./Dots"
import classes from "./Hero.module.css"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export function Hero() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          <Text component="span" className={classes.highlight} inherit>
            Gestiona tus alquileres
          </Text>{" "}
          de manera simple
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Gestion.app te acompaña en todo el proceso de administración de alquileres. Desde la
            publicación de tu propiedad hasta la gestión de cobros y pagos.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            component={Link}
            href={Routes.LoginPage()}
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
          >
            Ingresar
          </Button>
          {/* <Button className={classes.control} size="lg">
            Purchase a license
          </Button> */}
        </div>
      </div>
    </Container>
  )
}
