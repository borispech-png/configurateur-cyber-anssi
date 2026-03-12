import { useMemo } from 'react';

/**
 * Hook pour détecter si l'application est en mode Webinaire.
 * - Mode Webinaire  : ?webinaire=true
 */
export const useWebinaire = () => {
  const { isWebinaire } = useMemo(() => {
    if (typeof window === 'undefined') return { isWebinaire: false };
    const params = new URLSearchParams(window.location.search);
    const webinaire = params.get('webinaire') === 'true';
    return { isWebinaire: webinaire };
  }, []);

  return { isWebinaire };
};
