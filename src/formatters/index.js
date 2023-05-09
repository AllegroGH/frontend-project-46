import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

const formatter = (array, formatName) => {
  if (formatName === 'stylish') return stylishFormatter(array);
  if (formatName === 'plain') return plainFormatter(array);
  return undefined;
};

export default formatter;
