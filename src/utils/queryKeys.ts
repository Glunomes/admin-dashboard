import type { AdminFilterParams } from '../hooks/useAdminFilters'

export type AdminListParams = AdminFilterParams

export const adminQueryKeys = {
  wallets: ['wallets'] as const,
  users: ['users'] as const,
  walletList: (params: AdminListParams) => ['wallets', params] as const,
  userList: (params: AdminListParams) => ['users', params] as const,
}
