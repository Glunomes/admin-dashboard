import { useQuery } from "@tanstack/react-query";
import { getWallets } from "../api/mockApi";
import { useEffect, useState } from "react";
import {
  isWalletStatus,
  WALLET_STATUSES,
  type WalletStatus,
} from "../types/wallets";

export const WalletList = () => {
  type StatusFilter = 'all' | WalletStatus

  const [search, setSearch] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') ?? ''
  });
  const [status, setStatus] = useState<StatusFilter>(() => {
    const statusParam = new URLSearchParams(window.location.search).get('status')
    return statusParam && isWalletStatus(statusParam)
      ? statusParam
      : 'all'
  });
  const [page, setPage] = useState(() => {
    const pageParam = new URLSearchParams(window.location.search).get('page')
    const parsedPage = Number(pageParam)
    return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
  });
  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = Number(
      new URLSearchParams(window.location.search).get('pageSize'),
    )
    return [5, 10, 15].includes(pageSizeParam) ? pageSizeParam : 5
  });

  useEffect(() => {
    const syncFiltersWithUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setSearch(params.get('search') ?? '')
      const statusParam = params.get('status')
      setStatus(statusParam && isWalletStatus(statusParam) ? statusParam : 'all')

      const pageParam = Number(params.get('page'))
      setPage(Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1)

      const pageSizeParam = Number(params.get('pageSize'))
      setPageSize([5, 10, 15].includes(pageSizeParam) ? pageSizeParam : 5)
    }

    window.addEventListener('popstate', syncFiltersWithUrl)
    return () => window.removeEventListener('popstate', syncFiltersWithUrl)
  }, [])

  const { data, isPending, error } = useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredWallets = data.filter((wallet) => {
    const matchesSearch = wallet.address
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesStatus = status === 'all' || wallet.status === status
    return matchesSearch && matchesStatus
  })
  const totalPages = Math.ceil(filteredWallets.length / pageSize)
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const visibleWallets = filteredWallets.slice(startIndex, startIndex + pageSize)

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
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    )
  }

  const updatePage = (nextPage: number) => {
    const clampedPage = Math.max(1, Math.min(nextPage, totalPages))
    setPage(clampedPage)

    const params = new URLSearchParams(window.location.search)
    params.set('page', String(clampedPage))
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    )
  }

  const updatePageSize = (value: number) => {
    setPageSize(value)
    setPage(1)

    const params = new URLSearchParams(window.location.search)
    params.set('pageSize', String(value))
    params.set('page', '1')
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    )
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
    const query = params.toString()
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search by address"
          className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2"
        />
        <div className="flex shrink-0 items-center gap-3">
          <label className="flex items-center gap-2">
            Status
            <select
              value={status}
              onChange={(event) => updateStatus(event.target.value)}
              className="rounded-md border border-slate-300 px-2 py-2"
            >
              <option value="all">All</option>
              {WALLET_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Rows
            <select
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
              className="rounded-md border border-slate-300 px-2 py-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </label>
        </div>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-slate-300 px-4 py-2">Address</th>
            <th className="border border-slate-300 px-4 py-2">Balance</th>
            <th className="border border-slate-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {visibleWallets.length > 0 ? (
            visibleWallets.map((wallet) => (
              <tr key={wallet.id}>
                <td className="border border-slate-300 px-4 py-2">{wallet.address}</td>
                <td className="border border-slate-300 px-4 py-2">{wallet.balance}</td>
                <td className="border border-slate-300 px-4 py-2">{wallet.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border border-slate-300 px-4 py-6 text-center">
                No wallets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {filteredWallets.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => updatePage(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-3">
            <label>
              Page
              <select
                value={safePage}
                onChange={(event) => updatePage(Number(event.target.value))}
                className="ml-2 rounded-md border border-slate-300 px-2 py-1"
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <option key={pageNumber} value={pageNumber}>
                      {pageNumber}
                    </option>
                  ),
                )}
              </select>
            </label>
            <span>of {totalPages}</span>
          </div>
          <button
            type="button"
            onClick={() => updatePage(safePage + 1)}
            disabled={safePage === totalPages}
            className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}