const fs = require('fs');
let shop = fs.readFileSync('src/data/shop.ts', 'utf8');

const verticalImages = [
  '/assets/projects/Bombayphilia/d8b75e_8c4bb68c06464764be3a23d978863346~mv2.webp',
  '/assets/projects/Thinking Cap/d8b75e_4646182b70ad46e7b91222f19145faac~mv2.webp',
  '/assets/projects/Packaging Design/d8b75e_b83a6500bc6641a4ae2e5cf7447b5ee9~mv2.webp',
  '/assets/projects/Text Me/d8b75e_92e99096c84b485da519b64e0bb8e536~mv2.webp',
  '/assets/projects/Illustration & Sketches/d8b75e_6e96498ab923431f862265e05d2509ed~mv2.webp',
  '/assets/projects/Bombayphilia/d8b75e_a0839acd31dd4984ae84ce826d094043~mv2.webp',
  '/assets/projects/Illustration & Sketches/d8b75e_83cd4eec04eb4932af096384e0b4b535~mv2.webp',
  '/assets/projects/Bombayphilia Shoot/d8b75e_0772efab406b4901841954d3500d7a2f~mv2.webp',
  '/assets/projects/Bombayphilia Shoot/d8b75e_387ba6dcc67c4ba282d77724cdface08~mv2.webp',
  '/assets/projects/Illustration & Sketches/d8b75e_db4eac8ae76b4f039c86415d6c1a616e~mv2.webp',
  '/assets/projects/Bombayphilia Shoot/d8b75e_48272af2069c4f5198f3f29bf1a78a28~mv2.webp',
  '/assets/projects/Bombayphilia Shoot/d8b75e_8e2bc8cdb66447748971820f1c4fc8cf~mv2.webp',
  '/assets/projects/Bombayphilia Shoot/d8b75e_9218cad4bf7f4df4a3348bb38378c67e~mv2.webp',
  '/assets/projects/Illustration & Sketches/d8b75e_dd5fe0027a1c44c795c89d602f2d9b6b~mv2.webp',
  '/assets/projects/Bombayphilia Shoot/d8b75e_b122b484f3b3456d9b952b9cb4975bb2~mv2.webp',
  '/assets/projects/Illustration & Sketches/d8b75e_fbf2bd9c6cbb4f218c142028a7cf3990~mv2.webp'
];

let i = 0;
shop = shop.replace(/mainImage:\s*'[^']+'/g, () => {
  const img = verticalImages[i];
  i++;
  return `mainImage: '${img}'`;
});

i = 0;
shop = shop.replace(/images:\s*\[\s*\{\s*src:\s*'([^']+)'(.*?)\]/gs, (match, p1, p2) => {
  const img = verticalImages[i];
  i++;
  return `images: [{ src: '${img}'${p2}]`;
});

fs.writeFileSync('src/data/shop.ts', shop);
console.log('Successfully updated 16 products with vertical images.');
