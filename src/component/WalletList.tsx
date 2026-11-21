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
    <ul>
      {data.map(wallet => (
        <li key={wallet.id}>
          <p>Address: {wallet.address}</p>
          <p>Balance: {wallet.balance}</p>
          <p>Status: {wallet.status}</p>
        </li>
      ))}
    </ul>
  )
}