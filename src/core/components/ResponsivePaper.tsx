import React from "react"
import { Paper } from "@mantine/core"

const ResponsivePaper = ({ children, ...props }) => {
  return (
    <Paper p={{ base: "md", sm: "xl" }} {...props}>
      {children}
    </Paper>
  )
}

export default ResponsivePaper
