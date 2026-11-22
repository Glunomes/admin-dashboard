import { WalletStatuses } from '../types/wallets'
import type { useAdminFilters } from '../hooks/useAdminFilters'
import { PageSizes } from '../hooks/useAdminFilters'

type AdminFiltersProps = {
  filters: ReturnType<typeof useAdminFilters>
}

export function AdminFilters({ filters }: AdminFiltersProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <input
        type="search"
        value={filters.search}
        onChange={(event) => filters.updateSearch(event.target.value)}
        placeholder="Search by address or user"
        className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2"
      />
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
