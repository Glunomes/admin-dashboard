import { mockUsers } from '../data/mockUsers'
import { mockWallets } from '../data/mockWallets'
import type { User } from '../types/users'
import type { Wallet } from '../types/wallets'

export type UpdateDataInput = {
  user: Pick<User, 'name' | 'email'>
  wallet: Pick<Wallet, 'address' | 'balance' | 'status'>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

let users = mockUsers.map((user) => ({ ...user }))
let wallets = mockWallets.map((wallet) => ({ ...wallet }))

function waitForMockResponse(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 400)
  })
}

export async function getUsers(): Promise<User[]> {
  await waitForMockResponse()
  return users.map((user) => ({ ...user }))
}

export async function getWallets(): Promise<Wallet[]> {
  await waitForMockResponse()
  return wallets.map((wallet) => ({ ...wallet }))
}

export async function updateWalletAndUser(
  walletId: string,
  data: UpdateDataInput,
): Promise<{ user: User; wallet: Wallet }> {
  await waitForMockResponse()

  if (data.wallet.address === '500') {
    throw new ApiError('Simulated server error', 500)
  }

  const wallet = wallets.find((currentWallet) => currentWallet.id === walletId)
  if (!wallet) {
    throw new Error(`Wallet "${walletId}" was not found`)
  }

  const user = users.find((currentUser) => currentUser.id === wallet.userId)
  if (!user) {
    throw new Error(`User "${wallet.userId}" for wallet "${walletId}" was not found`)
  }

  const updatedWallet: Wallet = {
    ...wallet,
    ...data.wallet,
  }
  const updatedUser: User = {
    ...user,
    ...data.user,
  }

  wallets = wallets.map((currentWallet) =>
    currentWallet.id === walletId ? updatedWallet : currentWallet,
  )
  users = users.map((currentUser) =>
    currentUser.id === user.id ? updatedUser : currentUser,
  )

  return {
    user: { ...updatedUser },
    wallet: { ...updatedWallet },
  }
}