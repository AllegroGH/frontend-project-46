import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import { buildDiff } from './build.js';
import parseFile from './parsers.js';
import formatter from './formatters/index.js';

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'Error: file(s) does not exist';

  const data1 = parseFile(fullPath1);
  const data2 = parseFile(fullPath2);
  if (!data1 || !data2) return 'Error: wrong data';
  const diffStructure = buildDiff(data1, data2);
  return formatter(diffStructure, format) || 'Error: wrong format';
};

export default genDiff;
