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
