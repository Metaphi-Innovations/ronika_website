import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings, SiteSettingsData } from '../api/contentApi';

interface SiteContextType {
  settings: SiteSettingsData | null;
  loading: boolean;
  error: string | null;
}

const SiteContext = createContext<SiteContextType>({
  settings: null,
  loading: true,
  error: null,
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getSiteSettings()
      .then((data) => {
        if (isMounted) {
          setSettings(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Failed to load site settings from CMS:', err);
          setError(err.message || 'Failed to load site settings');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
