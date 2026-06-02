import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export function useAdminGuard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user.tipo === 'administrador') return;

    if (user.tipo === 'cliente') {
      router.replace('/(drawer)/cliente/listar-filmes');
      return;
    }

    router.replace('/login');
  }, [router, user.tipo]);
}
