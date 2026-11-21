export const WALLET_STATUSES = ['active', 'inactive'] as const
export type WalletStatus = (typeof WALLET_STATUSES)[number]

export function isWalletStatus(value: string): value is WalletStatus {
  return WALLET_STATUSES.some((status) => status === value)
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  status: WalletStatus;
};