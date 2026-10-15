/**
 * Shared RGL Layout Constants & Normalization Utility
 * Used across Frontend Public Portfolio (MediaGridRenderer)
 */

export const RGL_COLS = 12;
export const RGL_ROW_HEIGHT = 150;
export const RGL_MARGIN: [number, number] = [10, 10];
export const DEFAULT_ITEM_W = 2;
export const DEFAULT_ITEM_H = 1;

export interface NormalizedLayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  v?: number;
}

export interface ResponsiveGridConfig {
  cols: number;
  rowHeight: number;
  margin: [number, number];
  breakpoint: 'lg' | 'md' | 'sm';
}

/**
 * Computes responsive grid columns, rowHeight, and margins based on container width.
 * Row height scales proportionally to column width to eliminate vertical-tube distortion.
 */
export function getResponsiveGridConfig(containerWidth: number): ResponsiveGridConfig {
  const safeWidth = Math.max(300, containerWidth || 1200);

  if (safeWidth >= 1024) {
    const marginX = 10;
    const marginY = 10;
    const cols = 12;
    const colWidth = (safeWidth - (cols - 1) * marginX) / cols;
    // Scales smoothly: at 1200px width, colWidth ~90.8px, rowHeight ~136-150px
    const rowHeight = Math.max(120, Math.min(180, Math.round(colWidth * 1.5)));
    return {
      cols,
      rowHeight,
      margin: [marginX, marginY],
      breakpoint: 'lg',
    };
  }

  if (safeWidth >= 768) {
    const marginX = 8;
    const marginY = 8;
    const cols = 12;
    const colWidth = (safeWidth - (cols - 1) * marginX) / cols;
    // Tablet: 12 columns with proportional row height preserves exact desktop aspect ratios
    const rowHeight = Math.max(70, Math.round(colWidth * 1.5));
    return {
      cols,
      rowHeight,
      margin: [marginX, marginY],
      breakpoint: 'md',
    };
  }

  // Mobile (< 768px): 6 adaptive columns
  const marginX = 8;
  const marginY = 8;
  const cols = 6;
  const colWidth = (safeWidth - (cols - 1) * marginX) / cols;
  const rowHeight = Math.max(45, Math.round(colWidth * 1.15));
  return {
    cols,
    rowHeight,
    margin: [marginX, marginY],
    breakpoint: 'sm',
  };
}

export function normalizeLayoutItem(raw: any): NormalizedLayoutItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const w = Number(raw.w);
  const h = Number(raw.h);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;

  const isLegacy96 = w > RGL_COLS || h > 8;
  const safeW = isLegacy96 ? Math.max(1, Math.min(RGL_COLS, Math.round(w / 8))) : Math.min(RGL_COLS, Math.max(1, w));
  const safeH = isLegacy96 ? Math.max(1, Math.round(h / 16)) : Math.min(20, Math.max(1, h));
  const safeX = isLegacy96 ? Math.round((Number(raw.x) || 0) / 8) % RGL_COLS : Math.max(0, Math.min(RGL_COLS - safeW, Number(raw.x) || 0));
  const safeY = isLegacy96 ? Math.round((Number(raw.y) || 0) / 16) : Math.max(0, Number(raw.y) || 0);

  return {
    x: safeX,
    y: safeY,
    w: safeW,
    h: safeH,
    v: 2
  };
}

export function compactLayout<T extends { i: string; x: number; y: number; w: number; h: number }>(
  items: T[],
  cols: number = RGL_COLS
): T[] {
  const sorted = [...items].sort((a, b) => {
    if (a.y === b.y) return a.x - b.x;
    return a.y - b.y;
  });

  const compacted: T[] = [];

  for (const item of sorted) {
    let bestY = item.y;

    while (bestY > 0) {
      const testY = bestY - 1;
      const collides = compacted.some(other => {
        const overlapX = item.x < (other.x + other.w) && (item.x + item.w) > other.x;
        const overlapY = testY < (other.y + other.h) && (testY + item.h) > other.y;
        return overlapX && overlapY;
      });

      if (collides) break;
      bestY = testY;
    }

    compacted.push({
      ...item,
      y: bestY
    });
  }

  return items.map(original => compacted.find(c => c.i === original.i) || original);
}

/**
 * Derives a mobile-optimized 6-column presentation from desktop 12-column layout.
 * Preserves reading order, natural aspect ratios, and pairs without distorting artwork.
 */
export function deriveMobileLayout(
  items: any[],
  containerWidth: number,
  config: ResponsiveGridConfig
): any[] {
  const safeWidth = Math.max(300, containerWidth || 360);
  const marginX = config.margin[0];
  const marginY = config.margin[1];
  const colWidth = (safeWidth - (config.cols - 1) * marginX) / config.cols;

  // 1. Sort items in canonical desktop reading order
  const sorted = [...items].map((item, index) => {
    const norm = normalizeLayoutItem(item.layouts?.lg);
    return {
      item,
      index,
      id: String(item._id || item.id || index),
      norm: norm || { x: (index * 2) % 12, y: Math.floor((index * 2) / 12) * 2, w: 6, h: 2 },
    };
  }).sort((a, b) => {
    if (a.norm.y === b.norm.y) return a.norm.x - b.norm.x;
    return a.norm.y - b.norm.y;
  });

  const placed: any[] = [];

  for (const { id, norm, item } of sorted) {
    const desktopW = norm.w;
    const desktopH = norm.h;
    const rawAspect = Number(item.aspectRatio) || (item.image && Number(item.image.aspectRatio));
    const aspectRatio = rawAspect && !isNaN(rawAspect) && rawAspect > 0.2 && rawAspect < 5.0
      ? rawAspect
      : (desktopW * 1.0) / Math.max(1, desktopH * 1.4);

    let mobileW = 6;
    if (desktopW >= 9) {
      // Full-width desktop item -> full width on mobile
      mobileW = 6;
    } else if (desktopW >= 5) {
      // Half-width on desktop
      if (aspectRatio < 1.25 || desktopH > desktopW) {
        // Portrait or square items sit side-by-side in pairs
        mobileW = 3;
      } else {
        // Wide landscape artwork with text gets full width on narrow mobile (< 540px)
        mobileW = safeWidth >= 540 ? 3 : 6;
      }
    } else {
      // Small items / mockups: comfortable half-width on mobile
      mobileW = 3;
    }

    // Calculate proportional height to match natural aspect ratio
    const itemWidthPx = mobileW * colWidth + (mobileW - 1) * marginX;
    const targetHeightPx = itemWidthPx / Math.max(0.4, Math.min(3.0, aspectRatio));
    const mobileH = Math.max(1, Math.min(12, Math.round((targetHeightPx - marginY) / (config.rowHeight + marginY))));

    // Find first non-colliding (x, y) slot in 6-col mobile space
    let placedX = 0;
    let placedY = 0;
    let found = false;

    for (let testY = 0; testY < 500; testY++) {
      for (let testX = 0; testX <= config.cols - mobileW; testX += (mobileW === 3 ? 3 : mobileW)) {
        const collides = placed.some(other => {
          const overlapX = testX < (other.x + other.w) && (testX + mobileW) > other.x;
          const overlapY = testY < (other.y + other.h) && (testY + mobileH) > other.y;
          return overlapX && overlapY;
        });

        if (!collides) {
          placedX = testX;
          placedY = testY;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    placed.push({
      i: id,
      x: placedX,
      y: placedY,
      w: mobileW,
      h: mobileH,
      static: true,
      isDraggable: false,
      isResizable: false,
    });
  }

  return compactLayout(placed, config.cols);
}
