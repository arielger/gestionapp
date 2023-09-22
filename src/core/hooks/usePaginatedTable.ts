import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

export const usePaginatedTable = <T>({
  query,
  recordsPerPage = 100,
}: {
  query: (...args: any) => Promise<{
    items: T[]
    count: number
  }>
  recordsPerPage?: number
}) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ items, count }] = usePaginatedQuery(query, {
    orderBy: { id: "asc" },
    skip: recordsPerPage * page,
    take: recordsPerPage,
  })

  // We discount 1 from the page because the router starts at 0
  const goToPage = (page: number) => router.push({ query: { page: page - 1 } })

  return {
    items,
    count,
    page,
    goToPage,
    recordsPerPage,
  }
}
