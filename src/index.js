import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import { buildDiff } from './build.js';
import parseFiles from './parsers.js';
import formatter from './formatters/index.js';

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'invalid paths or filenames';

  const [data1, data2] = parseFiles(fullPath1, fullPath2);
  if (!data1 || !data2) return 'wrong data';
  const diffStructure = buildDiff(data1, data2);
  // return diffStructure[0][3][6][3][0][3][0];
  return formatter(diffStructure, format) || 'wrong format';
};

export default genDiff;
