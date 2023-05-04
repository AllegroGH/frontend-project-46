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

const genDiffString = (key, value, withFile = 0) => {
  const firstFilePrefix = '  - ';
  const secondFilePrefix = '  + ';
  const bothFilesPrefix = '    ';
  const valueDelimiter = ': ';

  switch (withFile) {
    case 0:
      return `${bothFilesPrefix}${key}${valueDelimiter}${value}`;
    case 1:
      return `${firstFilePrefix}${key}${valueDelimiter}${value}`;
    case 2:
      return `${secondFilePrefix}${key}${valueDelimiter}${value}`;
    default:
      return '';
  }
};

const jsonDiff = (filepath1, filepath2) => {
  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'Incorrect data';

  const json1 = JSON.parse(readFileSync(fullPath1, 'utf8'));
  const json2 = JSON.parse(readFileSync(fullPath2, 'utf8'));
  const sortedKeys = _.sortBy(_.union(Object.keys(json1), Object.keys(json2)));

  const diffArray = sortedKeys.reduce((acc, key) => {
    if (Object.hasOwn(json1, key) && Object.hasOwn(json2, key) && json1[key] === json2[key]) {
      acc.push(genDiffString(key, json1[key]), '\n');
      return acc;
    }
    if (Object.hasOwn(json1, key)) acc.push(genDiffString(key, json1[key], 1), '\n');
    if (Object.hasOwn(json2, key)) acc.push(genDiffString(key, json2[key], 2), '\n');
    return acc;
  }, []);
  return `{
${diffArray.join('')}}`;
};

const genDiff = (filepath1, filepath2, format) => {
  if (!format && getFormat(filepath1, filepath2) === '.json') return jsonDiff(filepath1, filepath2);
  return undefined;
};

export default genDiff;
