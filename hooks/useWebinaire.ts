import { useMemo } from 'react';

/**
 * Hook pour détecter si l'application est en mode Webinaire.
 * S'active en ajoutant `?webinaire=true` à l'URL.
 * Exemple : https://borispech-png.github.io/configurateur-cyber-anssi/?webinaire=true
 */
export const useWebinaire = () => {
  const isWebinaire = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('webinaire') === 'true';
  }, []);

  return { isWebinaire };
};
