import { WalletStatuses } from '../types/wallets'
import type { useAdminFilters } from '../hooks/useAdminFilters'
import { PageSizes } from '../hooks/useAdminFilters'

type AdminFiltersProps = {
  filters: ReturnType<typeof useAdminFilters>
  isFetching: boolean
}

export function AdminFilters({ filters, isFetching }: AdminFiltersProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 max-w-md flex-1 items-center gap-3">
        <input
          type="search"
          value={filters.search}
          onFocus={filters.beginSearchEdit}
          onChange={(event) => filters.updateSearch(event.target.value)}
          placeholder="Search by address or user"
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2"
        />
        <div
          role="status"
          className="w-20 shrink-0 text-sm text-slate-500"
          aria-live="polite"
        >
          {isFetching ? (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
              />
              Updating
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <label className="flex items-center gap-2">
          Status
          <select
            value={filters.status}
            onChange={(event) => filters.updateStatus(event.target.value)}
            className="rounded-md border border-slate-300 px-2 py-2"
          >
            <option value="all">All</option>
            {WalletStatuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Rows
          <select
            value={filters.pageSize}
            onChange={(event) =>
              filters.updatePageSize(Number(event.target.value))
            }
            className="rounded-md border border-slate-300 px-2 py-2"
          >
            {PageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
