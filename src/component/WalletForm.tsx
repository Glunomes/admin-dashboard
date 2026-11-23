import * as Dialog from '@radix-ui/react-dialog'
import type { SubmitEvent } from 'react'
import { useState } from 'react'
import type { CreateDataInput } from '../api/mockApi'
import { WalletStatuses, type WalletStatus } from '../types/wallets'
import { parseWalletForm } from '../utils/parseWalletForm'

export type WalletFormValues = {
  userName: string
  userEmail: string
  address: string
  balance: number
  status: WalletStatus
}

type WalletFormProps = {
  initialValues: WalletFormValues
  isPending: boolean
  errorMessage: string | null
  submitLabel: string
  onSubmit: (data: CreateDataInput) => void
}

export function WalletForm({
  initialValues,
  isPending,
  errorMessage,
  submitLabel,
  onSubmit,
}: WalletFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const result = parseWalletForm(formData)

    if (!result.data) {
      setFormError(result.error)
      return
    }

    onSubmit(result.data)
  }

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">User name</span>
        <input
          name="userName"
          required
          defaultValue={initialValues.userName}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">User email</span>
        <input
          name="userEmail"
          type="email"
          required
          defaultValue={initialValues.userEmail}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Address</span>
        <input
          name="address"
          required
          defaultValue={initialValues.address}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Balance</span>
        <input
          name="balance"
          type="number"
          required
          min="0"
          step="0.01"
          defaultValue={initialValues.balance}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Status</span>
        <select
          name="status"
          defaultValue={initialValues.status}
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
          disabled={isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
      {(formError || errorMessage) && (
        <p role="alert" className="text-sm text-red-600">
          {formError ?? errorMessage}
        </p>
      )}
    </form>
  )
}
