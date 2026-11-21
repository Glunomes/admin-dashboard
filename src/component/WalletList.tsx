import { useQuery } from "@tanstack/react-query";
import { getWallets } from "../api/mockApi";
import { useEffect, useState } from "react";

export const WalletList = () => {
  const [search, setSearch] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') ?? ''
  });

  useEffect(() => {
    const syncSearchWithUrl = () => {
      setSearch(new URLSearchParams(window.location.search).get('search') ?? '')
    }

    window.addEventListener('popstate', syncSearchWithUrl)
    return () => window.removeEventListener('popstate', syncSearchWithUrl)
  }, [])

  const { data, isPending, error } = useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredWallets = data.filter((wallet) =>
    wallet.address.toLowerCase().includes(search.toLowerCase()),
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
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
  }

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(event) => updateSearch(event.target.value)}
        placeholder="Search by address"
        className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
      />
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-slate-300 px-4 py-2">Address</th>
            <th className="border border-slate-300 px-4 py-2">Balance</th>
            <th className="border border-slate-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredWallets.length > 0 ? (
            filteredWallets.map((wallet) => (
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
    </div>
  )
}