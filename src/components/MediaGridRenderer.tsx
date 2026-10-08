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

const COLS = 48;
const ROW_HEIGHT = 40;
const MARGIN: [number, number] = [8, 8];

export const MediaGridRenderer: React.FC<MediaGridRendererProps> = ({ items }) => {
  const { width, ref } = useWidth();
  const layouts = useMemo(() => {
    return items.map((item, index) => {
      const itemId = String(item._id || item.id || index);
      
      if (item.layouts && item.layouts.lg) {
        return {
          i: itemId,
          x: item.layouts.lg.x || 0,
          y: item.layouts.lg.y || 0,
          w: item.layouts.lg.w || 6,
          h: item.layouts.lg.h || 6,
          static: true,
          isDraggable: false,
          isResizable: false
        };
      }
      
      return null;
    }).filter(Boolean) as any[];
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
        compactType={null}
        preventCollision={true}
      >
        {items.map((item, index) => {
          const itemId = String(item._id || item.id || index);
          // Only render if we successfully mapped a layout for it
          if (!layouts.find(l => l.i === itemId)) return null;

          return (
            <div key={itemId} style={{ overflow: 'hidden' }}>
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
