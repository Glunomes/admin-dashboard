import type { StatusFilter } from '../hooks/useAdminFilters'

export type AdminListParams = {
  search: string
  status: StatusFilter
  page: number
  pageSize: number
}

export const adminQueryKeys = {
  wallets: ['wallets'] as const,
  users: ['users'] as const,
  walletList: (params: AdminListParams) => ['wallets', params] as const,
  userList: (params: AdminListParams) => ['users', params] as const,
}
