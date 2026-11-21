export type WalletStatus = 'active' | 'inactive';

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  status: WalletStatus;
};