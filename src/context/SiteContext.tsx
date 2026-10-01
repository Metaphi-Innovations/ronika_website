import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSiteSettings, SiteSettingsData } from '../api/contentApi';
import { useLiveResource } from './LiveSyncContext';

interface SiteContextType {
  settings: SiteSettingsData | null;
  loading: boolean;
  error: string | null;
  reloadSettings: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({
  settings: null,
  loading: true,
  error: null,
  reloadSettings: async () => {},
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
      if (data.siteTitle) {
        document.title = data.siteTitle;
      }
      if (data.metaDescription) {
        const metaTag = document.querySelector('meta[name="description"]');
        if (metaTag) {
          metaTag.setAttribute('content', data.metaDescription);
        }
      }
      setError(null);
    } catch (err: any) {
      console.warn('Failed to load site settings from CMS:', err);
      setError(err.message || 'Failed to load site settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Live CMS Synchronization for global settings / social links / metadata
  useLiveResource(['settings', 'contact'], () => {
    fetchSettings();
  });

  return (
    <SiteContext.Provider value={{ settings, loading, error, reloadSettings: fetchSettings }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
