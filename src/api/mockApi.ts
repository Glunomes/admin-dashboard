import { mockUsers } from '../data/mockUsers'
import { mockWallets } from '../data/mockWallets'
import type { User } from '../types/users'
import type { Wallet } from '../types/wallets'

function waitForMockResponse() {
  return new Promise((resolve) => {
    setTimeout(resolve, 400)
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