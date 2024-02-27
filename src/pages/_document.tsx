import { ColorSchemeScript } from "@mantine/core"
import { createGetInitialProps } from "@mantine/next"
import Document, { Html, Main, NextScript, Head } from "next/document"

const getInitialProps = createGetInitialProps()

class MyDocument extends Document {
  static getInitialProps = getInitialProps

  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }
  render() {
    return (
      <Html lang="es">
        <Head>
          <ColorSchemeScript defaultColorScheme="auto" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
