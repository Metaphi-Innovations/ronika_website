import React, { useMemo } from 'react';
import RGL from 'react-grid-layout/legacy';
import { getImageUrl } from '../utils/imageUrl';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useWidth } from '../hooks/useWidth';
import {
  RGL_COLS,
  RGL_ROW_HEIGHT,
  RGL_MARGIN,
  DEFAULT_ITEM_W,
  DEFAULT_ITEM_H,
  normalizeLayoutItem,
  compactLayout
} from '../utils/gridLayout';

const ReactGridLayout = RGL as any;

interface MediaGridRendererProps {
  items: any[];
  preserveLayout?: boolean;
}

export const MediaGridRenderer: React.FC<MediaGridRendererProps> = ({ items, preserveLayout = false }) => {
  const { width, ref } = useWidth();
  const layouts = useMemo(() => {
    // 1. Check if all items have valid normalized layouts
    const allHaveNorm = items.length > 0 && items.every(item => Boolean(normalizeLayoutItem(item.layouts?.lg)));

    // When preserveLayout is requested or all items have valid layouts, render exact saved coordinates directly!
    if (preserveLayout || allHaveNorm) {
      return items.map((item, index) => {
        const itemId = String(item._id || item.id || index);
        const norm = normalizeLayoutItem(item.layouts?.lg);
        if (norm) {
          return {
            i: itemId,
            x: norm.x,
            y: norm.y,
            w: norm.w,
            h: norm.h,
            static: true,
            isDraggable: false,
            isResizable: false
          };
        }
        return {
          i: itemId,
          x: (index * DEFAULT_ITEM_W) % RGL_COLS,
          y: Math.floor((index * DEFAULT_ITEM_W) / RGL_COLS) * DEFAULT_ITEM_H,
          w: DEFAULT_ITEM_W,
          h: DEFAULT_ITEM_H,
          static: true,
          isDraggable: false,
          isResizable: false
        };
      });
    }

    // Default legacy path: slot missing items & compact
    let nextRowY = 0;
    items.forEach(item => {
      const norm = normalizeLayoutItem(item.layouts?.lg);
      if (norm) {
        const bottom = norm.y + norm.h;
        if (bottom > nextRowY) nextRowY = bottom;
      }
    });

    let currentX = 0;
    let currentY = nextRowY;

    // 2. Map items into layout elements
    const initialElements = items.map((item, index) => {
      const itemId = String(item._id || item.id || index);
      const norm = normalizeLayoutItem(item.layouts?.lg);
      
      if (norm) {
        return {
          i: itemId,
          x: norm.x,
          y: norm.y,
          w: norm.w,
          h: norm.h,
          static: true,
          isDraggable: false,
          isResizable: false
        };
      }
      
      const itemX = currentX;
      const itemY = currentY;

      currentX += DEFAULT_ITEM_W;
      if (currentX + DEFAULT_ITEM_W > RGL_COLS) {
        currentX = 0;
        currentY += DEFAULT_ITEM_H;
      }

      return {
        i: itemId,
        x: itemX,
        y: itemY,
        w: DEFAULT_ITEM_W,
        h: DEFAULT_ITEM_H,
        static: true,
        isDraggable: false,
        isResizable: false
      };
    });

    // 3. Compact vertically to match Admin RGL compaction guarantees
    const compacted = compactLayout(initialElements, RGL_COLS);
    return compacted.map(item => ({
      ...item,
      static: true,
      isDraggable: false,
      isResizable: false
    }));
  }, [items, preserveLayout]);

  if (!items || items.length === 0) return null;

  const isExactLayout = preserveLayout || (items.length > 0 && items.every(item => Boolean(normalizeLayoutItem(item.layouts?.lg))));

  return (
    <div className="media-grid-renderer" style={{ width: '100%' }} ref={ref}>
      {width > 0 && (
      <ReactGridLayout
        className="layout"
        layout={layouts}
        cols={RGL_COLS}
        rowHeight={RGL_ROW_HEIGHT}
        width={width}
        margin={RGL_MARGIN}
        gridConfig={{ cols: RGL_COLS, rowHeight: RGL_ROW_HEIGHT, margin: RGL_MARGIN }}
        isDraggable={false}
        isResizable={false}
        isDroppable={false}
        useCSSTransforms={true}
        compactType={isExactLayout ? null : "vertical"}
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
