import { useEffect, useRef, useCallback } from 'react';

interface UseAutoRefreshOptions {
  onRefresh: () => void | Promise<void>;
  interval?: number; // em milissegundos
  enabled?: boolean;
}

/**
 * Hook para atualização automática de dados
 * @param onRefresh - Função a ser executada a cada intervalo
 * @param interval - Intervalo em milissegundos (padrão: 60000ms = 1 minuto)
 * @param enabled - Se a atualização automática está habilitada (padrão: true)
 */
export function useAutoRefresh({ 
  onRefresh, 
  interval = 60000, 
  enabled = true 
}: UseAutoRefreshOptions) {
  const savedCallback = useRef<(() => void | Promise<void>) | null>(null);

  // Salva a callback mais recente
  useEffect(() => {
    savedCallback.current = onRefresh;
  }, [onRefresh]);

  // Configura o intervalo
  useEffect(() => {
    if (!enabled) return;

    const tick = async () => {
      if (savedCallback.current) {
        await savedCallback.current();
      }
    };

    // Executa imediatamente
    tick();

    // Configura o intervalo
    const id = setInterval(tick, interval);

    // Limpa o intervalo ao desmontar
    return () => clearInterval(id);
  }, [interval, enabled]);

  // Retorna uma função para forçar atualização manual
  const forceRefresh = useCallback(async () => {
    if (savedCallback.current) {
      await savedCallback.current();
    }
  }, []);

  return { forceRefresh };
}
