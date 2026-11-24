import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { createWalletAndUser, type CreateDataInput } from '../api/mockApi'
import { useSaveWalletMutation } from '../hooks/useSaveWalletMutation'
import { WalletForm } from './WalletForm'

export function CreateWalletDialog() {
  const [open, setOpen] = useState(false)

  const createMutation = useSaveWalletMutation(
    (data: CreateDataInput) => createWalletAndUser(data),
    () => setOpen(false),
  )

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!createMutation.isPending) {
          setOpen(nextOpen)
          if (nextOpen) {
            createMutation.reset()
          }
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Add user & wallet
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/50 transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl outline-none data-[state=open]:opacity-100 data-[state=closed]:opacity-0">
          <Dialog.Title className="text-xl font-semibold text-slate-900">
            Add user and wallet
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-slate-600">
            Create a user and their wallet
          </Dialog.Description>

          <WalletForm
            initialValues={{
              userName: '',
              userEmail: '',
              address: '',
              balance: 0,
              status: 'active',
            }}
            isPending={createMutation.isPending}
            errorMessage={createMutation.error?.message ?? null}
            submitLabel={createMutation.isPending ? 'Creating...' : 'Create'}
            onSubmit={(data) => createMutation.mutate(data)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
