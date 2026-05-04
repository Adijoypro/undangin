const sharp = require('sharp');
const path = require('path');

const input = 'public/assets/nusantara_divider.png';
const output = 'public/assets/nusantara_divider.webp';

sharp(input)
  .webp({ quality: 80 })
  .toFile(output)
  .then(() => console.log('Successfully converted to webp'))
  .catch(err => console.error('Conversion failed:', err));
