import { useEffect, useState } from 'react'
import {
  isWalletStatus,
  type Wallet,
  type WalletStatus,
} from '../types/wallets'
import type { User } from '../types/users'

export type StatusFilter = 'all' | WalletStatus

export const PageSizes = [5, 10, 15] as const

function getInitialSearch() {
  return new URLSearchParams(window.location.search).get('search') ?? ''
}

function getInitialStatus(): StatusFilter {
  const status = new URLSearchParams(window.location.search).get('status')
  return status && isWalletStatus(status) ? status : 'all'
}

function getInitialPage() {
  const parsedPage = Number(
    new URLSearchParams(window.location.search).get('page'),
  )
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

function getInitialPageSize() {
  const parsedPageSize = Number(
    new URLSearchParams(window.location.search).get('pageSize'),
  )
  return PageSizes.includes(
    parsedPageSize as (typeof PageSizes)[number],
  )
    ? (parsedPageSize as (typeof PageSizes)[number])
    : 5
}

function replaceUrlParams(params: URLSearchParams) {
  const query = params.toString()
  window.history.replaceState(
    null,
    '',
    query ? `${window.location.pathname}?${query}` : window.location.pathname,
  )
}

export function useAdminFilters(wallets: Wallet[], users: User[] = []) {
  const [search, setSearch] = useState(getInitialSearch)
  const [status, setStatus] = useState<StatusFilter>(getInitialStatus)
  const [page, setPage] = useState(getInitialPage)
  const [pageSize, setPageSize] =
    useState<(typeof PageSizes)[number]>(getInitialPageSize)

  useEffect(() => {
    const syncFiltersWithUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setSearch(params.get('search') ?? '')

      const statusParam = params.get('status')
      setStatus(
        statusParam && isWalletStatus(statusParam) ? statusParam : 'all',
      )

      const parsedPage = Number(params.get('page'))
      setPage(
        Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
      )

      const parsedPageSize = Number(params.get('pageSize'))
      setPageSize(
        PageSizes.includes(
          parsedPageSize as (typeof PageSizes)[number],
        )
          ? (parsedPageSize as (typeof PageSizes)[number])
          : 5,
      )
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
    replaceUrlParams(params)
  }

  const updateStatus = (value: string) => {
    if (value !== 'all' && !isWalletStatus(value)) {
      return
    }

    setStatus(value)
    setPage(1)

    const params = new URLSearchParams(window.location.search)
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }

    params.set('page', '1')
    replaceUrlParams(params)
  }

  const updatePage = (nextPage: number) => {
    const clampedPage = Math.max(1, Math.min(nextPage, totalPages))
    setPage(clampedPage)

    const params = new URLSearchParams(window.location.search)
    params.set('page', String(clampedPage))
    replaceUrlParams(params)
  }

  const updatePageSize = (value: number) => {
    if (!PageSizes.includes(value as (typeof PageSizes)[number])) {
      return
    }

    const nextPageSize = value as (typeof PageSizes)[number]
    setPageSize(nextPageSize)
    setPage(1)

    const params = new URLSearchParams(window.location.search)
    params.set('pageSize', String(nextPageSize))
    params.set('page', '1')
    replaceUrlParams(params)
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
    updateStatus,
    updatePage,
    updatePageSize,
  }
}
