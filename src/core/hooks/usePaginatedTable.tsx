import { usePaginatedQuery } from "@blitzjs/rpc"
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
  const [{ items, count }, { isLoading, isFetching, isPreviousData }] = usePaginatedQuery(query, {
    orderBy: { id: "asc" },
    skip: recordsPerPage * page,
    take: recordsPerPage,
    suspense: false,
    ...queryParams,
  })

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
  } satisfies Partial<DataTableProps<T>>

  return {
    tableProps,
    items,
  }
}
