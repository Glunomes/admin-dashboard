import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useSaveWalletMutation<TInput>(
  mutationFn: (input: TInput) => Promise<unknown>,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wallets'] }),
        queryClient.invalidateQueries({ queryKey: ['users'] }),
      ])
      onSuccess?.()
    },
  })
}
