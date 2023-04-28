import { cwd } from 'node:process';
import { resolve as pathResolve, extname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import _ from 'lodash';

const getFormat = (filepath1, filepath2) => {
  const format1 = extname(filepath1);
  const format2 = extname(filepath2);
  if (format1 === format2) return format1;
  return 'incorrect';
};

const genDiffString = (key, value, withFile = 'bothFiles') => {
  const firstFilePrefix = '  - ';
  const secondFilePrefix = '  + ';
  const bothFilesPrefix = '    ';
  const valueDelimiter = ': ';

  switch (withFile) {
    case 'firstFile':
      return `${firstFilePrefix}${key}${valueDelimiter}${value}`;
    case 'secondFile':
      return `${secondFilePrefix}${key}${valueDelimiter}${value}`;
    case 'bothFiles':
      return `${bothFilesPrefix}${key}${valueDelimiter}${value}`;
    default:
      return '';
  }
};

const jsonDiff = (filepath1, filepath2) => {
  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!existsSync(fullPath1) && !existsSync(fullPath2)) return 'Incorrect data';

  const jsonFile1 = JSON.parse(readFileSync(fullPath1, 'utf8'));
  const jsonFile2 = JSON.parse(readFileSync(fullPath2, 'utf8'));
  const sortedKeys = _.sortBy(_.union(Object.keys(jsonFile1), Object.keys(jsonFile2)));

  const diffArray = sortedKeys.reduce(
    (acc, key) => {
      if (Object.hasOwn(jsonFile1, key)) {
        if (Object.hasOwn(jsonFile2, key)) {
          if (jsonFile1[key] === jsonFile2[key]) {
            acc.push(genDiffString(key, jsonFile1[key], 'bothFiles'), '\n');
          } else {
            acc.push(genDiffString(key, jsonFile1[key], 'firstFile'), '\n');
            acc.push(genDiffString(key, jsonFile2[key], 'secondFile'), '\n');
          }
        } else acc.push(genDiffString(key, jsonFile1[key], 'firstFile'), '\n');
      } else acc.push(genDiffString(key, jsonFile2[key], 'secondFile'), '\n');
      return acc;
    },
    ['{\n'],
  );
  return `${diffArray.join('')}}`;
};

const genDiff = (filepath1, filepath2, format) => {
  if (!format && getFormat(filepath1, filepath2) === '.json') return jsonDiff(filepath1, filepath2);
  return undefined;
};

export default genDiff;
