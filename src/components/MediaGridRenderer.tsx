import React, { useMemo } from 'react';
import RGL from 'react-grid-layout';
import { getImageUrl } from '../utils/imageUrl';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useWidth } from '../hooks/useWidth';

const ReactGridLayout = RGL as any;

interface MediaGridRendererProps {
  items: any[];
}

const COLS = 96;
const ROW_HEIGHT = 16;
const MARGIN: [number, number] = [8, 8];

export const MediaGridRenderer: React.FC<MediaGridRendererProps> = ({ items }) => {
  const { width, ref } = useWidth();
  const layouts = useMemo(() => {
    return items.map((item, index) => {
      const itemId = String(item._id || item.id || index);
      
      if (item.layouts && item.layouts.lg) {
        const l = item.layouts.lg;
        const isV2 = l.v === 2;
        return {
          i: itemId,
          x: isV2 ? l.x : (l.x * 2 || 0),
          y: isV2 ? l.y : (l.y * 2 || 0),
          w: isV2 ? l.w : (l.w * 2 || 32),
          h: isV2 ? l.h : Math.max(1, l.h * 2 || 24),
          static: true,
          isDraggable: false,
          isResizable: false
        };
      }
      
      return {
        i: itemId,
        x: (index * 16) % COLS,
        y: Math.floor((index * 16) / COLS) * 12,
        w: 16,
        h: 12,
        static: true,
        isDraggable: false,
        isResizable: false
      };
    });
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="media-grid-renderer" style={{ width: '100%' }} ref={ref}>
      {width > 0 && (
      <ReactGridLayout
        className="layout"
        layout={layouts}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={width}
        margin={MARGIN}
        isDraggable={false}
        isResizable={false}
        isDroppable={false}
        useCSSTransforms={true}
        compactType="vertical"
        preventCollision={false}
      >
        {items.map((item, index) => {
          const itemId = String(item._id || item.id || index);
          // Only render if we successfully mapped a layout for it
          if (!layouts.find(l => l.i === itemId)) return null;

          return (
            <div key={itemId} data-grid={layouts.find(l => l.i === itemId)} style={{ overflow: 'hidden', width: '100%', height: '100%', minWidth: 0, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src={getImageUrl(item.url)} 
                alt={item.caption || item.originalName || 'Gallery image'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                loading="lazy"
                draggable={false}
              />
            </div>
          );
        })}
      </ReactGridLayout>
      )}
    </div>
  );
};
