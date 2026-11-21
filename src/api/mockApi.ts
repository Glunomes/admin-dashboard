import { mockUsers } from '../data/mockUsers'
import { mockWallets } from '../data/mockWallets'
import type { User } from '../types/users'
import type { Wallet } from '../types/wallets'

const MOCK_DELAY_MS = 400

function waitForMockResponse(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY_MS)
  })
}

export async function getUsers(): Promise<User[]> {
  await waitForMockResponse()
  return mockUsers
}

export async function getWallets(): Promise<Wallet[]> {
  await waitForMockResponse()
  return mockWallets
}
