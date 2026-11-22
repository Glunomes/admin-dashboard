import { useQuery } from "@tanstack/react-query";
import { getUsers, getWallets } from "../api/mockApi";
import { useAdminFilters } from "../hooks/useAdminFilters";
import { AdminFilters } from "./AdminFilters";
import { AdminPagination } from "./AdminPagination";
import { AdminTable } from "./AdminTable";

export const AdminList = () => {
  const walletsQuery = useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
  });
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const filters = useAdminFilters(
    walletsQuery.data ?? [],
    usersQuery.data ?? [],
  )

  if (walletsQuery.isPending || usersQuery.isPending) {
    return <div>Loading...</div>
  }
  if (walletsQuery.error) {
    return <div>Error: {walletsQuery.error.message}</div>
  }
  if (usersQuery.error) {
    return <div>Error: {usersQuery.error.message}</div>
  }

  return (
    <div>
      <AdminFilters filters={filters} />
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