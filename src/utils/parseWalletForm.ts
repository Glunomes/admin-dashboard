import type { CreateDataInput } from '../api/mockApi'
import { isWalletStatus } from '../types/wallets'

type ParsedWalletForm =
  { data: CreateDataInput; error: null } | { data: null; error: string }

export function parseWalletForm(formData: FormData): ParsedWalletForm {
  const getStringField = (name: string): string | null => {
    const value = formData.get(name)
    return typeof value === 'string' ? value : null
  }

  const name = getStringField('userName')
  const email = getStringField('userEmail')
  const address = getStringField('address')
  const balanceValue = getStringField('balance')
  const statusValue = getStringField('status')

  if (
    name === null ||
    email === null ||
    address === null ||
    balanceValue === null ||
    statusValue === null
  ) {
    return {
      data: null,
      error:
        'Could not read all form fields. Please check the form and try again.',
    }
  }

  if (!isWalletStatus(statusValue)) {
    return { data: null, error: 'Please select a valid wallet status.' }
  }

  const balance = Number(balanceValue)
  if (!Number.isFinite(balance) || balance < 0) {
    return {
      data: null,
      error: 'Balance must be a valid non-negative number.',
    }
  }

  return {
    data: {
      user: { name: name.trim(), email: email.trim() },
      wallet: { address: address.trim(), balance, status: statusValue },
    },
    error: null,
  }
}
