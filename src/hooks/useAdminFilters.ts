import { useEffect, useRef, useState } from 'react'
import {
  isWalletStatus,
  type Wallet,
  type WalletStatus,
} from '../types/wallets'
import type { User } from '../types/users'

export type StatusFilter = 'all' | WalletStatus

export const PageSizes = [5, 10, 15] as const

export type AdminFilterParams = {
  search: string
  status: StatusFilter
  page: number
  pageSize: (typeof PageSizes)[number]
}

export function getAdminFilterParams(): AdminFilterParams {
  const params = new URLSearchParams(window.location.search)
  const search = params.get('search') ?? ''

  const statusParam = params.get('status')
  const status =
    statusParam && isWalletStatus(statusParam) ? statusParam : 'all'

  const parsedPage = Number(params.get('page'))
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const parsedPageSize = Number(params.get('pageSize'))
  const pageSize = PageSizes.find((size) => size === parsedPageSize) ?? 5

  return { search, status, page, pageSize }
}

function writeUrlParams(params: URLSearchParams, replace = false) {
  const query = params.toString()
  const writeHistory = replace
    ? window.history.replaceState
    : window.history.pushState

  writeHistory.call(
    window.history,
    null,
    '',
    query ? `${window.location.pathname}?${query}` : window.location.pathname,
  )
}

export function useAdminFilters(wallets: Wallet[], users: User[] = []) {
  const initialParams = getAdminFilterParams()
  const [search, setSearch] = useState(initialParams.search)
  const [status, setStatus] = useState<StatusFilter>(initialParams.status)
  const [page, setPage] = useState(initialParams.page)
  const [pageSize, setPageSize] = useState<(typeof PageSizes)[number]>(
    initialParams.pageSize,
  )
  const searchHistoryEntryCreated = useRef(false)

  useEffect(() => {
    const syncFiltersWithUrl = () => {
      const params = getAdminFilterParams()
      searchHistoryEntryCreated.current = false
      setSearch(params.search)
      setStatus(params.status)
      setPage(params.page)
      setPageSize(params.pageSize)
    }

    window.addEventListener('popstate', syncFiltersWithUrl)
    return () => window.removeEventListener('popstate', syncFiltersWithUrl)
  }, [])

  const usersById = new Map(users.map((user) => [user.id, user]))
  const normalizedSearch = search.toLowerCase()

  const filteredWallets = wallets.filter((wallet) => {
    const user = usersById.get(wallet.userId)
    const matchesSearch =
      wallet.address.toLowerCase().includes(normalizedSearch) ||
      (user?.name.toLowerCase().includes(normalizedSearch) ?? false)
    const matchesStatus = status === 'all' || wallet.status === status
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredWallets.length / pageSize)
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const visibleWallets = filteredWallets.slice(
    startIndex,
    startIndex + pageSize,
  )

  const updateSearch = (value: string) => {
    setSearch(value)

    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }

    params.set('page', '1')
    setPage(1)
    writeUrlParams(params, searchHistoryEntryCreated.current)
    searchHistoryEntryCreated.current = true
  }

  const beginSearchEdit = () => {
    searchHistoryEntryCreated.current = false
  }

  const updateStatus = (value: string) => {
    if (value !== 'all' && !isWalletStatus(value)) {
      return
    }

    searchHistoryEntryCreated.current = false
    setStatus(value)
    setPage(1)

    const params = new URLSearchParams(window.location.search)
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }

    params.set('page', '1')
    writeUrlParams(params)
  }

  const updatePage = (nextPage: number) => {
    const clampedPage = Math.max(1, Math.min(nextPage, totalPages))
    searchHistoryEntryCreated.current = false
    setPage(clampedPage)

    const params = new URLSearchParams(window.location.search)
    params.set('page', String(clampedPage))
    writeUrlParams(params)
  }

  const updatePageSize = (value: number) => {
    const nextPageSize = PageSizes.find((size) => size === value)
    if (!nextPageSize) {
      return
    }

    searchHistoryEntryCreated.current = false
    setPageSize(nextPageSize)
    setPage(1)

    const params = new URLSearchParams(window.location.search)
    params.set('pageSize', String(nextPageSize))
    params.set('page', '1')
    writeUrlParams(params)
  }

  return {
    search,
    status,
    pageSize,
    safePage,
    totalPages,
    filteredWallets,
    visibleWallets,
    updateSearch,
    beginSearchEdit,
    updateStatus,
    updatePage,
    updatePageSize,
  }
}
