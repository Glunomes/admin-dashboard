import { useQuery } from '@tanstack/react-query'
import { getUsers, getWallets } from '../api/mockApi'
import {
  getAdminFilterParamsFromUrl,
  useAdminFilters,
} from '../hooks/useAdminFilters'
import { AdminFilters } from './AdminFilters'
import { AdminPagination } from './AdminPagination'
import { AdminTable } from './AdminTable'
import { CreateWalletDialog } from './CreateWalletDialog'
import { adminQueryKeys } from '../utils/queryKeys'

export const AdminList = () => {
  const listParams = getAdminFilterParamsFromUrl()

  const walletsQuery = useQuery({
    queryKey: adminQueryKeys.walletList(listParams),
    queryFn: getWallets,
    placeholderData: (previousData) => previousData,
  })
  const usersQuery = useQuery({
    queryKey: adminQueryKeys.userList(listParams),
    queryFn: getUsers,
    placeholderData: (previousData) => previousData,
  })
  const filters = useAdminFilters(
    walletsQuery.data ?? [],
    usersQuery.data ?? [],
  )

  if (!walletsQuery.data || !usersQuery.data) {
    if (walletsQuery.error) {
      return <div>Error: {walletsQuery.error.message}</div>
    }
    if (usersQuery.error) {
      return <div>Error: {usersQuery.error.message}</div>
    }
    return <div>Loading...</div>
  }
  const listError = walletsQuery.error ?? usersQuery.error
  if (listError) {
    return <div>Error: {listError.message}</div>
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CreateWalletDialog />
      </div>
      <AdminFilters
        filters={filters}
        isFetching={walletsQuery.isFetching || usersQuery.isFetching}
      />
      <AdminTable wallets={filters.visibleWallets} users={usersQuery.data} />
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
