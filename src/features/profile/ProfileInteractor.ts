
import { useMemo } from 'react';
import { useUserOperations } from '@/hooks/useUserOperations';
import { useWalletOperations } from '@/hooks/useWalletOperations';

export function useProfileInteractor() {
  const userOps = useUserOperations();

  const walletOps = useWalletOperations({
    userId: userOps.userData?.user?.id,
    userRefetch: userOps.userRefetch,
  });

  return useMemo(() => ({
    ...userOps,
    ...walletOps,
  }), [userOps, walletOps]);
}

export type ProfileInteractor = ReturnType<typeof useProfileInteractor>;

