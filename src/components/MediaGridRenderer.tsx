import React, { useMemo } from 'react';
import RGL from 'react-grid-layout/legacy';
import { getImageUrl } from '../utils/imageUrl';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useWidth } from '../hooks/useWidth';

const ReactGridLayout = RGL as any;

interface MediaGridRendererProps {
  items: any[];
}

const COLS = 12;
const ROW_HEIGHT = 150;
const MARGIN: [number, number] = [10, 10];
const DEFAULT_THUMBNAIL_W = 2;
const DEFAULT_THUMBNAIL_H = 1;

export const MediaGridRenderer: React.FC<MediaGridRendererProps> = ({ items }) => {
  const { width, ref } = useWidth();
  const layouts = useMemo(() => {
    let nextRowY = 0;
    items.forEach(item => {
      const l = item.layouts?.lg;
      if (l && typeof l.y === 'number' && typeof l.h === 'number') {
        const isLegacy96 = l.w > COLS || l.h > 8;
        const h = isLegacy96 ? Math.max(1, Math.round(l.h / 16)) : l.h;
        const y = isLegacy96 ? Math.round((l.y || 0) / 16) : l.y;
        const bottom = (y || 0) + (h || 1);
        if (bottom > nextRowY) nextRowY = bottom;
      }
    });

    let currentX = 0;
    let currentY = nextRowY;

    return items.map((item, index) => {
      const itemId = String(item._id || item.id || index);
      
      if (item.layouts && item.layouts.lg) {
        const l = item.layouts.lg;
        const isLegacy96 = l.w > COLS || l.h > 8;
        const safeW = isLegacy96 ? Math.max(1, Math.min(COLS, Math.round(l.w / 8))) : Math.min(COLS, Math.max(1, l.w));
        const safeH = isLegacy96 ? Math.max(1, Math.round(l.h / 16)) : Math.min(20, Math.max(1, l.h));
        const safeX = isLegacy96 ? Math.round((l.x || 0) / 8) % COLS : Math.max(0, l.x || 0);
        const safeY = isLegacy96 ? Math.round((l.y || 0) / 16) : Math.max(0, l.y || 0);

        return {
          i: itemId,
          x: safeX,
          y: safeY,
          w: safeW,
          h: safeH,
          static: true,
          isDraggable: false,
          isResizable: false
        };
      }
      
      const itemX = currentX;
      const itemY = currentY;

      currentX += DEFAULT_THUMBNAIL_W;
      if (currentX + DEFAULT_THUMBNAIL_W > COLS) {
        currentX = 0;
        currentY += DEFAULT_THUMBNAIL_H;
      }

      return {
        i: itemId,
        x: itemX,
        y: itemY,
        w: DEFAULT_THUMBNAIL_W,
        h: DEFAULT_THUMBNAIL_H,
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
        gridConfig={{ cols: COLS, rowHeight: ROW_HEIGHT, margin: MARGIN }}
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
