const fs = require('fs');
let content = fs.readFileSync('src/data/shop.ts', 'utf8');
content = content.replace(/details:\s*\{[^\}]+\},/g, `features: [
      'High-quality archival materials',
      'Signed and numbered by the artist',
      'Certificate of authenticity included',
      'Securely packaged for global shipping'
    ],`);
fs.writeFileSync('src/data/shop.ts', content);
console.log('shop.ts updated');
