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
    <table className="w-full overflow-hidden rounded-lg border-collapse bg-white text-left">
      <thead>
        <tr className="bg-slate-800 text-white">
          <th className="border border-slate-700 px-4 py-3">User</th>
          <th className="border border-slate-700 px-4 py-3">Email</th>
          <th className="border border-slate-700 px-4 py-3">Address</th>
          <th className="border border-slate-700 px-4 py-3">Balance</th>
          <th className="border border-slate-700 px-4 py-3">Status</th>
          <th className="border border-slate-700 px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {wallets.length > 0 ? (
          wallets.map((wallet) => {
            const user = usersById.get(wallet.userId)

            return (
              <tr
                key={wallet.id}
                className="even:bg-slate-50 hover:bg-slate-100"
              >
                <td className="border border-slate-200 px-4 py-3">
                  {user?.name ?? 'Unknown user'}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  {user?.email ?? '-'}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  {wallet.address}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  {wallet.balance}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  {wallet.status}
                </td>
                <td className="border border-slate-200 p-0">
                  <EditWalletDialog wallet={wallet} user={user} />
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td
              colSpan={6}
              className="border border-slate-300 px-4 py-6 text-center"
            >
              No wallets found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
