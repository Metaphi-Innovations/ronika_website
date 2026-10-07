import React, { useMemo } from 'react';
import RGL from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useWidth } from '../hooks/useWidth';
import { useDesignState } from '../hooks/useDesignState';

const ReactGridLayout = RGL as any;

export interface ILayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ILayouts {
  lg?: ILayoutItem;
  md?: ILayoutItem;
  sm?: ILayoutItem;
  xs?: ILayoutItem;
}

export interface GridMediaItem {
  id: string; // The _id from IImage or IGalleryImage
  url: string;
  layouts?: ILayouts;
  caption?: string; // Optional caption for galleries
}

interface MediaGridRendererProps {
  items: GridMediaItem[];
}

// Convert our custom layouts format to RGL's expected layouts format
const mapItemsToRGL = (items: GridMediaItem[]) => {
  const rglLayouts: any = { lg: [], md: [], sm: [], xs: [] };
  
  items.forEach((item, index) => {
    ['lg', 'md', 'sm', 'xs'].forEach((bp) => {
      const bLayout = item.layouts?.[bp as keyof ILayouts];
      if (bLayout) {
        rglLayouts[bp].push({
          i: item.id,
          x: bLayout.x,
          y: bLayout.y,
          w: bLayout.w,
          h: bLayout.h,
          static: true, // renderer is static
        });
      } else {
        // Migration / Default layout fallback
        rglLayouts[bp].push({
          i: item.id,
          x: (index * 2) % 12,
          y: Math.floor((index * 2) / 12) * 2,
          w: 2,
          h: 2,
          static: true,
        });
      }
    });
  });
  
  return rglLayouts;
};

export const MediaGridRenderer: React.FC<MediaGridRendererProps> = ({ items }) => {
  const layouts = useMemo(() => mapItemsToRGL(items), [items]);
  const { width, ref } = useWidth();
  const { breakpoint, cols } = useDesignState();

  console.log("MediaGridRenderer items:", items);
  console.log("MediaGridRenderer layouts:", layouts);

  if (!items || items.length === 0) return null;

  return (
    <div className="media-grid-renderer" ref={ref}>
      {width > 0 && (
        <ReactGridLayout
          width={width}
          className="layout"
          layout={layouts[breakpoint]}
          cols={cols}
          rowHeight={100} // This should be consistent with admin. 
          isDraggable={false}
          isResizable={false}
          compactType="vertical"
          margin={[16, 16]}
        >
          {items.map((item) => (
            <div key={item.id} className="grid-item-wrapper" style={{ overflow: 'hidden' }}>
              <img 
                src={item.url} 
                alt={item.caption || "Portfolio item"} 
                style={{ width: '100%', height: '100%', objectFit: 'fill' }} 
                loading="lazy"
              />
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  );
};
