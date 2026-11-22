import * as Dialog from '@radix-ui/react-dialog'
import {
  isWalletStatus,
  WalletStatuses,
  type Wallet,
} from '../types/wallets'
import type { User } from '../types/users'
import type { SubmitEvent } from 'react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ApiError,
  updateWalletAndUser,
  type UpdateDataInput,
} from '../api/mockApi'

type EditWalletDialogProps = {
  wallet: Wallet
  user?: User
}

export function EditWalletDialog({ wallet, user }: EditWalletDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDataInput) =>
      updateWalletAndUser(wallet.id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wallets'] }),
        queryClient.invalidateQueries({ queryKey: ['users'] }),
      ])
      setOpen(false)
    },
  })

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
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
      setFormError('Could not read all form fields. Please check the form and try again.')
      return
    }

    const status = statusValue
    if (!isWalletStatus(status)) {
      setFormError('Please select a valid wallet status.')
      return
    }

    const balance = Number(balanceValue)
    if (!Number.isFinite(balance) || balance < 0) {
      setFormError('Balance must be a valid non-negative number.')
      return
    }

    const data = {
      user: {
        name: name.trim(),
        email: email.trim(),
      },
      wallet: {
        address: address.trim(),
        balance,
        status,
      },
    }

    updateMutation.mutate(data)
  }

  const mutationErrorMessage = updateMutation.error
    ? updateMutation.error instanceof ApiError
      ? `${updateMutation.error.message} (HTTP ${updateMutation.error.status})`
      : updateMutation.error.message
    : null

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!updateMutation.isPending) {
          setOpen(nextOpen)
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="w-full px-4 py-2 text-center hover:bg-slate-100"
        >
          Edit
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/50 transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl outline-none data-[state=open]:opacity-100 data-[state=closed]:opacity-0">
          <Dialog.Title className="text-xl font-semibold text-slate-900">
            Edit wallet
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-slate-600">
            Update the user and wallet details
          </Dialog.Description>

          <form
            className="mt-4 space-y-4"
            onSubmit={handleSubmit}
          >
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">
                User name
              </span>
              <input
                name="userName"
                required
                defaultValue={user?.name ?? ''}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">
                User email
              </span>
              <input
                name="userEmail"
                type="email"
                required
                defaultValue={user?.email ?? ''}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">
                Address
              </span>
              <input
                name="address"
                required
                defaultValue={wallet.address}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">
                Balance
              </span>
              <input
                name="balance"
                type="number"
                required
                min="0"
                step="0.01"
                defaultValue={wallet.balance}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                name="status"
                defaultValue={wallet.status}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              >
                {WalletStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
            {(formError || mutationErrorMessage) && (
              <p role="alert" className="text-sm text-red-600">
                {formError ?? mutationErrorMessage}
              </p>
            )}
          </form>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded p-1 text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
