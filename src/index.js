import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import _ from 'lodash';
import parseFiles from './parsers.js';

const genDiffString = (json1, json2, key) => {
  const firstFilePrefix = '  - ';
  const secondFilePrefix = '  + ';
  const bothFilesPrefix = '    ';
  const valueDelimiter = ': ';

  if (Object.hasOwn(json1, key) && Object.hasOwn(json2, key) && json1[key] === json2[key]) return `${bothFilesPrefix}${key}${valueDelimiter}${json1[key]}\u{000A}`;
  let result = '';
  if (Object.hasOwn(json1, key)) result = `${firstFilePrefix}${key}${valueDelimiter}${json1[key]}\u{000A}`;
  if (Object.hasOwn(json2, key)) result = `${result}${secondFilePrefix}${key}${valueDelimiter}${json2[key]}\u{000A}`;
  return result;
};

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  if (format !== 'stylish') return 'NEED FORMATER!';

  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'incorrect data';

  const [data1, data2] = parseFiles(fullPath1, fullPath2);
  const sortedKeys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));

  const diffArray = sortedKeys.reduce((acc, key) => {
    acc.push(genDiffString(data1, data2, key));
    return acc;
  }, []);
  return `{\u{000A}${diffArray.join('')}}`;
};

export default gendiff;
