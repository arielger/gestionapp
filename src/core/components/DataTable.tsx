import { DataTable as MantineDataTable, DataTableProps } from "mantine-datatable"

export const DataTable = <T,>(props: DataTableProps<T>) => (
  <MantineDataTable
    withBorder
    borderRadius="sm"
    highlightOnHover
    minHeight={!props.records?.length ? 240 : undefined}
    noRecordsText="No se encontraron resultados"
    {...props}
  />
)
