import { useQuery } from "@tanstack/react-query";
import { getWallets } from "../api/mockApi";
import { WalletStatuses } from "../types/wallets";
import { PageSizes, useWalletFilters } from "../hooks/useWalletFilters";

export const WalletList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const {
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
  } = useWalletFilters(data)

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
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
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