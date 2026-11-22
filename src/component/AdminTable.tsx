import type { User } from '../types/users'
import type { Wallet } from '../types/wallets'
import { EditWalletDialog } from './EditWalletDialog'

type AdminTableProps = {
  wallets: Wallet[]
  users: User[]
}

export function AdminTable({ wallets, users }: AdminTableProps) {
  const usersById = new Map(users.map((user) => [user.id, user]))

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-slate-300 px-4 py-2">User</th>
          <th className="border border-slate-300 px-4 py-2">Email</th>
          <th className="border border-slate-300 px-4 py-2">Address</th>
          <th className="border border-slate-300 px-4 py-2">Balance</th>
          <th className="border border-slate-300 px-4 py-2">Status</th>
          <th className="border border-slate-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {wallets.length > 0 ? (
          wallets.map((wallet) => {
            const user = usersById.get(wallet.userId)

            return (
              <tr key={wallet.id}>
                <td className="border border-slate-300 px-4 py-2">
                  {user?.name ?? 'Unknown user'}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {user?.email ?? '-'}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {wallet.address}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {wallet.balance}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {wallet.status}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  <EditWalletDialog wallet={wallet} />
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td colSpan={6} className="border border-slate-300 px-4 py-6 text-center">
              No wallets found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
