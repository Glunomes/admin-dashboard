import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminQueryKeys } from '../utils/queryKeys'

export function useSaveWalletMutation<TInput>(
  mutationFn: (input: TInput) => Promise<unknown>,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.wallets }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users }),
      ])
      onSuccess?.()
    },
  })
}
