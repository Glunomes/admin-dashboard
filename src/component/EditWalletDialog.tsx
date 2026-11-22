import * as Dialog from '@radix-ui/react-dialog'
import { WalletStatuses, type Wallet } from '../types/wallets'

type EditWalletDialogProps = {
  wallet: Wallet
}

export function EditWalletDialog({ wallet }: EditWalletDialogProps) {
  return (
    <Dialog.Root>
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
            Update the wallet details. Saving will be added next.
          </Dialog.Description>

          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Address</span>
              <input
                name="address"
                defaultValue={wallet.address}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Balance</span>
              <input
                name="balance"
                type="number"
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
                className="rounded-md bg-slate-900 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
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
