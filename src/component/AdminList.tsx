import { useQuery } from '@tanstack/react-query'
import { getUsers, getWallets } from '../api/mockApi'
import { getAdminFilterParams, useAdminFilters } from '../hooks/useAdminFilters'
import { AdminFilters } from './AdminFilters'
import { AdminPagination } from './AdminPagination'
import { AdminTable } from './AdminTable'
import { CreateWalletDialog } from './CreateWalletDialog'
import { adminQueryKeys } from '../utils/queryKeys'

export const AdminList = () => {
  const listParams = getAdminFilterParams()

  const {
    data: wallets,
    error: walletsError,
    isFetching: isFetchingWallets,
  } = useQuery({
    queryKey: adminQueryKeys.walletList(listParams),
    queryFn: getWallets,
    placeholderData: (previousData) => previousData,
  })
  const {
    data: users,
    error: usersError,
    isFetching: isFetchingUsers,
  } = useQuery({
    queryKey: adminQueryKeys.userList(listParams),
    queryFn: getUsers,
    placeholderData: (previousData) => previousData,
  })
  const filters = useAdminFilters(wallets ?? [], users ?? [])

  if (walletsError) {
    return <div>Error: {walletsError.message}</div>
  }
  if (usersError) {
    return <div>Error: {usersError.message}</div>
  }
  if (!wallets || !users) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CreateWalletDialog />
      </div>
      <AdminFilters
        filters={filters}
        isFetching={isFetchingWallets || isFetchingUsers}
      />
      <AdminTable wallets={filters.visibleWallets} users={users} />
      {filters.filteredWallets.length > 0 && (
        <AdminPagination
          safePage={filters.safePage}
          totalPages={filters.totalPages}
          updatePage={filters.updatePage}
        />
      )}
    </div>
  )
}
