import { useQuery } from "@tanstack/react-query";
import { getWallets } from "../api/mockApi";

export const WalletList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const res = await getWallets();
      if(!res) throw new Error('Failed to get wallets')
      return res;
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-slate-300 px-4 py-2">Address</th>
          <th className="border border-slate-300 px-4 py-2">Balance</th>
          <th className="border border-slate-300 px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((wallet) => (
          <tr key={wallet.id}>
            <td className="border border-slate-300 px-4 py-2">{wallet.address}</td>
            <td className="border border-slate-300 px-4 py-2">{wallet.balance}</td>
            <td className="border border-slate-300 px-4 py-2">{wallet.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}