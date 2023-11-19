import { usePaginatedQuery } from "@blitzjs/rpc"
import { Box } from "@mantine/core"
import { IconMoodSad } from "@tabler/icons-react"
import { DataTableProps } from "mantine-datatable"
import { useRouter } from "next/router"

export const usePaginatedTable = <T,>({
  query,
  recordsPerPage = 50,
  queryParams = {},
}: {
  query: (...args: any) => Promise<{
    items: T[]
    count: number
  }>
  recordsPerPage?: number
  queryParams?: Record<string, any> // todo: remove any
}) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ items, count }, { isLoading, isFetching, isPreviousData, isError }] = usePaginatedQuery(
    query,
    {
      orderBy: { id: "asc" },
      skip: recordsPerPage * page,
      take: recordsPerPage,
      suspense: false,
      ...queryParams,
    }
  )

  console.log("isError", isError)

  // We discount 1 from the page because the router starts at 0
  const goToPage = (page: number) => router.push({ query: { page: page - 1 } })

  // prevent showing loading state if is refetching query on mount
  const isTableFetching = isLoading || (isFetching && isPreviousData)

  // map the query results to Mantine DataTable props
  const tableProps = {
    // pagination props
    page: page + 1,
    onPageChange: (newPage) => goToPage(newPage),
    totalRecords: count,
    recordsPerPage,

    // status props
    fetching: isTableFetching,
    records: items,

    ...(isError
      ? {
          noRecordsIcon: (
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          ),
          noRecordsText: "Hubo un error al acceder a la información solicitada",
        }
      : {}),
  } satisfies Partial<DataTableProps<T>>

  return {
    tableProps,
    items,
  }
}
