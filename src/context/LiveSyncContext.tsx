import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL, invalidateCache } from '../api/apiClient';

type ResourceType =
  | 'home'
  | 'about'
  | 'contact'
  | 'settings'
  | 'projects'
  | 'categories'
  | 'services'
  | 'gallery'
  | 'galleryCategories'
  | 'shop'
  | 'shopCategories'
  | 'enquiries'
  | 'users'
  | 'all';

type ListenerCallback = (resource: ResourceType, id?: string) => void;

interface LiveSyncContextType {
  subscribe: (resources: ResourceType | ResourceType[], callback: ListenerCallback) => () => void;
}

const LiveSyncContext = createContext<LiveSyncContextType>({
  subscribe: () => () => {},
});

export const LiveSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listenersRef = useRef<Map<ResourceType, Set<ListenerCallback>>>(new Map());
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef<number>(2000); // Initial backoff: 2s

  const subscribe = useCallback(
    (resources: ResourceType | ResourceType[], callback: ListenerCallback) => {
      const list = Array.isArray(resources) ? resources : [resources];
      list.forEach((res) => {
        if (!listenersRef.current.has(res)) {
          listenersRef.current.set(res, new Set());
        }
        listenersRef.current.get(res)!.add(callback);
      });

      return () => {
        list.forEach((res) => {
          const set = listenersRef.current.get(res);
          if (set) {
            set.delete(callback);
            if (set.size === 0) {
              listenersRef.current.delete(res);
            }
          }
        });
      };
    },
    []
  );

  useEffect(() => {
    let isCancelled = false;

    const connectSSE = () => {
      if (isCancelled) return;

      const sseBase = API_BASE_URL.replace(/\/api\/?$/, '');
      const sseUrl = `${sseBase}/api/events`;

      try {
        const es = new EventSource(sseUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          // Reset backoff upon successful connection
          reconnectDelayRef.current = 2000;
        };

        es.onmessage = (event) => {
          if (!event.data) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'content.updated' && data.resource) {
              const res = data.resource as ResourceType;

              // 1. Invalidate frontend client cache for this resource
              invalidateCache(res);

              // 2. Notify specific subscribers
              const specificSet = listenersRef.current.get(res);
              if (specificSet) {
                specificSet.forEach((cb) => {
                  try {
                    cb(res, data.id);
                  } catch (e) {
                    console.error('Error in live sync listener:', e);
                  }
                });
              }

              // 3. Notify wildcard 'all' subscribers
              const allSet = listenersRef.current.get('all');
              if (allSet) {
                allSet.forEach((cb) => {
                  try {
                    cb(res, data.id);
                  } catch (e) {
                    console.error('Error in live sync wildcard listener:', e);
                  }
                });
              }
            }
          } catch {
            // Heartbeat or malformed frame; safe to ignore
          }
        };

        es.onerror = () => {
          es.close();
          eventSourceRef.current = null;

          if (!isCancelled) {
            // Exponential backoff up to 30 seconds
            const nextDelay = Math.min(reconnectDelayRef.current * 1.5, 30000);
            reconnectDelayRef.current = nextDelay;
            reconnectTimeoutRef.current = setTimeout(connectSSE, nextDelay);
          }
        };
      } catch (err) {
        // SSE not supported or initialization error, retry after backoff
        if (!isCancelled) {
          const nextDelay = Math.min(reconnectDelayRef.current * 1.5, 30000);
          reconnectDelayRef.current = nextDelay;
          reconnectTimeoutRef.current = setTimeout(connectSSE, nextDelay);
        }
      }
    };

    connectSSE();

    return () => {
      isCancelled = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <LiveSyncContext.Provider value={{ subscribe }}>
      {children}
    </LiveSyncContext.Provider>
  );
};

export const useLiveSync = () => useContext(LiveSyncContext);

/**
 * Convenient React hook to auto-subscribe a component to resource updates
 */
export function useLiveResource(
  resources: ResourceType | ResourceType[],
  onUpdate: (resource: ResourceType, id?: string) => void
) {
  const { subscribe } = useLiveSync();
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    return subscribe(resources, (res, id) => {
      callbackRef.current(res, id);
    });
  }, [subscribe, resources]);
}
