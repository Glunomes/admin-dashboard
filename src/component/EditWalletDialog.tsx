import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { updateWalletAndUser, type UpdateDataInput } from '../api/mockApi'
import { useSaveWalletMutation } from '../hooks/useSaveWalletMutation'
import type { User } from '../types/users'
import type { Wallet } from '../types/wallets'
import { WalletForm } from './WalletForm'

type EditWalletDialogProps = {
  wallet: Wallet
  user?: User
}

export function EditWalletDialog({ wallet, user }: EditWalletDialogProps) {
  const [open, setOpen] = useState(false)

  const updateMutation = useSaveWalletMutation(
    (data: UpdateDataInput) => updateWalletAndUser(wallet.id, data),
    () => setOpen(false),
  )

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!updateMutation.isPending) {
          setOpen(nextOpen)
          if (nextOpen) {
            updateMutation.reset()
          }
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

          <WalletForm
            initialValues={{
              userName: user?.name ?? '',
              userEmail: user?.email ?? '',
              address: wallet.address,
              balance: wallet.balance,
              status: wallet.status,
            }}
            isPending={updateMutation.isPending}
            errorMessage={updateMutation.error?.message ?? null}
            submitLabel={updateMutation.isPending ? 'Saving...' : 'Save'}
            onSubmit={(data) => updateMutation.mutate(data)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
