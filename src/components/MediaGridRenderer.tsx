import React, { useMemo } from 'react';
import RGL from 'react-grid-layout/legacy';
import { getImageUrl } from '../utils/imageUrl';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useWidth } from '../hooks/useWidth';
import {
  RGL_COLS,
  DEFAULT_ITEM_W,
  DEFAULT_ITEM_H,
  normalizeLayoutItem,
  compactLayout,
  getResponsiveGridConfig,
  deriveMobileLayout
} from '../utils/gridLayout';

const ReactGridLayout = RGL as any;

interface MediaGridRendererProps {
  items: any[];
  preserveLayout?: boolean;
  onItemClick?: (index: number) => void;
}

export const MediaGridRenderer: React.FC<MediaGridRendererProps> = ({ items, preserveLayout = false, onItemClick }) => {
  const { width, ref } = useWidth();
  
  // Calculate responsive columns, row height, and margins based on current container width
  const config = useMemo(() => getResponsiveGridConfig(width), [width]);

  const layouts = useMemo(() => {
    if (!items || items.length === 0) return [];

    // On mobile (< 768px), derive an adaptive 6-column presentation that prevents
    // items from collapsing into 20px vertical chimney tubes while preserving reading order
    if (config.breakpoint === 'sm') {
      return deriveMobileLayout(items, width, config);
    }

    // On Desktop and Tablet (>= 768px), render canonical desktop coordinates
    const allHaveNorm = items.length > 0 && items.every(item => Boolean(normalizeLayoutItem(item.layouts?.lg)));

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

    // Default fallback path for unpositioned items
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

    const compacted = compactLayout(initialElements, RGL_COLS);
    return compacted.map(item => ({
      ...item,
      static: true,
      isDraggable: false,
      isResizable: false
    }));
  }, [items, preserveLayout, config.breakpoint, config.cols, width]);

  if (!items || items.length === 0) return null;

  const isExactLayout = config.breakpoint !== 'sm' && (preserveLayout || (items.length > 0 && items.every(item => Boolean(normalizeLayoutItem(item.layouts?.lg)))));

  return (
    <div 
      className="media-grid-renderer" 
      style={{ 
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden' 
      }} 
      ref={ref}
    >
      {width > 0 && (
        <ReactGridLayout
          className="layout"
          layout={layouts}
          cols={config.cols}
          rowHeight={config.rowHeight}
          width={width}
          margin={config.margin}
          gridConfig={{ cols: config.cols, rowHeight: config.rowHeight, margin: config.margin }}
          isDraggable={false}
          isResizable={false}
          isDroppable={false}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
          {items.map((item, index) => {
            const itemId = String(item._id || item.id || index);
            if (!layouts.find(l => l.i === itemId)) return null;

            return (
              <div 
                key={itemId} 
                data-grid={layouts.find(l => l.i === itemId)} 
                style={{ 
                  overflow: 'hidden', 
                  width: '100%', 
                  height: '100%', 
                  minWidth: 0, 
                  minHeight: 0, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface, #F7F6F2)',
                  cursor: onItemClick ? 'pointer' : 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onClick={() => onItemClick && onItemClick(index)}
              >
                <img 
                  src={getImageUrl(item.url)} 
                  alt={item.caption || item.originalName || 'Gallery artwork'} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center', 
                    display: 'block' 
                  }}
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
