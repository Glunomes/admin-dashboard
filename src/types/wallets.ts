export const WalletStatuses = ['active', 'inactive'] as const
export type WalletStatus = (typeof WalletStatuses)[number]

export function isWalletStatus(value: string): value is WalletStatus {
  return WalletStatuses.some((status) => status === value)
}

export interface Wallet {
  id: string
  userId: string
  address: string
  balance: number
  status: WalletStatus
}
