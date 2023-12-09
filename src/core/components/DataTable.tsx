import React from "react"
import { DataTable as MantineDataTable, DataTableProps } from "mantine-datatable"

export const DataTable = <T,>(props: DataTableProps<T>) => (
  <MantineDataTable
    withTableBorder
    borderRadius="sm"
    highlightOnHover
    minHeight={!props.records?.length ? 240 : undefined}
    noRecordsText="No se encontraron resultados"
    {...props}
  />
)

export const actionsColumnConfig = {
  accessor: "actions",
  title: "Acciones",
  textAlign: "right" as const,
}
