/**
 * Frontend utility functions for Rich Text sanitization and rendering.
 */

export function sanitizeRichText(html?: string): string {
  if (!html) return '';

  // 1. Remove dangerous blocks (<script>, <style>, <iframe>, <object>, <embed>)
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Remove inline event listeners (onclick=, onerror=, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Prevent javascript: URLs
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"');

  // 4. Filter allowed tags and attributes
  const allowedTags = [
    'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del',
    'ol', 'ul', 'li', 'a', 'h3', 'div', 'span'
  ];

  clean = clean.replace(/<\/?([a-z0-9]+)\b[^>]*>/gi, (match, tagName) => {
    const lower = tagName.toLowerCase();
    if (!allowedTags.includes(lower)) {
      return ''; // Strip non-allowed tag
    }

    if (match.startsWith('</')) {
      return `</${lower}>`;
    }

    if (lower === 'a') {
      const hrefMatch = match.match(/href\s*=\s*["']([^"']*)["']/i);
      const href = hrefMatch ? hrefMatch[1] : '#';
      if (href.toLowerCase().startsWith('javascript:')) {
        return '<a>';
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    }

    const alignMatch = match.match(/style\s*=\s*["']([^"']*text-align\s*:\s*(left|center|right|justify)[^"']*)["']/i);
    if (alignMatch) {
      const sub = alignMatch[1].match(/text-align\s*:\s*(left|center|right|justify)/i);
      const textAlign = sub ? sub[1].toLowerCase() : '';
      if (textAlign) {
        return `<${lower} style="text-align: ${textAlign};">`;
      }
    }

    return `<${lower}>`;
  });

  return clean;
}

export function isHtmlString(str?: string): boolean {
  if (!str) return false;
  return /<[a-z][\s\S]*>/i.test(str);
}
