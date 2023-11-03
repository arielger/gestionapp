import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

export const usePaginatedTable = <T>({
  query,
  recordsPerPage = 100,
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
  const [{ items, count }, { isLoading, isFetching }] = usePaginatedQuery(query, {
    orderBy: { id: "asc" },
    skip: recordsPerPage * page,
    take: recordsPerPage,
    suspense: false,
    ...queryParams,
  })

  // We discount 1 from the page because the router starts at 0
  const goToPage = (page: number) => router.push({ query: { page: page - 1 } })

  return {
    items,
    count,
    page,
    goToPage,
    recordsPerPage,
    isLoading,
    isFetching,
  }
}
