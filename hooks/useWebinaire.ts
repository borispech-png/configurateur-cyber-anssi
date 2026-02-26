import { useMemo } from 'react';

/**
 * Hook pour détecter si l'application est en mode Webinaire et/ou mode Animateur.
 * - Mode Webinaire  : ?webinaire=true
 * - Mode Animateur  : ?webinaire=true&host=true  (contrôles secrets du timer)
 *
 * Exemple URL animateur :
 * https://borispech-png.github.io/configurateur-cyber-anssi/?webinaire=true&host=true
 */
export const useWebinaire = () => {
  const { isWebinaire, isHost } = useMemo(() => {
    if (typeof window === 'undefined') return { isWebinaire: false, isHost: false };
    const params = new URLSearchParams(window.location.search);
    const webinaire = params.get('webinaire') === 'true';
    const host = webinaire && params.get('host') === 'true';
    return { isWebinaire: webinaire, isHost: host };
  }, []);

  return { isWebinaire, isHost };
};
