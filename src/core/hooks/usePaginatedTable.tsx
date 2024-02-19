import { usePaginatedQuery } from "@blitzjs/rpc"
import { DataTableProps } from "mantine-datatable"
import { useRouter } from "next/router"
import { IconSquareX } from "@tabler/icons-react"

type QueryType<T> = (...args) => Promise<{
  items: T[]
  count: number
}>

export const usePaginatedTable = <T extends Record<string, unknown>>({
  query,
  recordsPerPage = 50,
  queryParams = {},
}: {
  query: QueryType<T>
  queryParams?: Parameters<QueryType<T>>[0]
  recordsPerPage?: number
}) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [data, { isLoading, isFetching, isPreviousData, isError, refetch }] = usePaginatedQuery(
    query,
    {
      orderBy: { id: "asc" },
      skip: recordsPerPage * page,
      take: recordsPerPage,
      ...queryParams,
    },
    {
      suspense: false,
      useErrorBoundary: false,
    }
  )

  // We discount 1 from the page because the router starts at 0
  const goToPage = (page: number) => router.push({ query: { page: page - 1 } })

  // prevent showing loading state if is refetching query on mount
  const isTableFetching = isLoading || (isFetching && isPreviousData)

  // map the query results to Mantine DataTable props
  const tableProps = {
    // pagination props
    page: page + 1,
    onPageChange: (newPage) => goToPage(newPage),
    totalRecords: data?.count,
    recordsPerPage,

    // status props
    fetching: isTableFetching,
    records: data?.items ?? [],

    ...(isError
      ? {
          noRecordsIcon: <IconSquareX />,
          noRecordsText: "Hubo un error al obtener el listado solicitado",
        }
      : {}),
  } satisfies Partial<DataTableProps<T>>

  return {
    tableProps,
    items: data?.items ?? [],
    refetch,
  }
}
