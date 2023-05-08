import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import _ from 'lodash';
import parseFiles from './parsers.js';

const genDiffString = (json1, json2, key, depth) => {
  const iter = (currentValue, iterDepth) => {
    const currentIndent = '    '.repeat(iterDepth);
    if (!_.isObject(currentValue)) return currentValue;
    const sortedKeys = _.sortBy(Object.keys(currentValue));
    const diffArray = sortedKeys.reduce((acc, keyA) => {
      if (_.isObject(currentValue[keyA])) {
        acc.push(`${currentIndent}${keyA}: ${iter(currentValue[keyA], iterDepth + 1)}`);
      } else {
        acc.push(`${currentIndent}${keyA}: ${currentValue[keyA]}`);
      }
      return acc;
    }, []);
    const newIndent = '    '.repeat(iterDepth - 1);
    return `{\u{000A}${diffArray.join('\n')}\u{000A}${newIndent}}`;
  };

  const firstFilePrefix = `${'    '.repeat(depth - 1)}  - `;
  const secondFilePrefix = `${'    '.repeat(depth - 1)}  + `;
  const bothFilesPrefix = `${'    '.repeat(depth - 1)}    `;
  const valueDelimiter = ': ';

  if (Object.hasOwn(json1, key) && Object.hasOwn(json2, key) && json1[key] === json2[key]) return `${bothFilesPrefix}${key}${valueDelimiter}${json1[key]}`;
  const result = [];
  if (Object.hasOwn(json1, key)) {
    if (_.isObject(json1[key])) {
      result.push(`${firstFilePrefix}${key}${valueDelimiter}${iter(json1[key], depth + 1)}`);
    } else result.push(`${firstFilePrefix}${key}${valueDelimiter}${json1[key]}`);
  }
  if (Object.hasOwn(json2, key)) {
    if (_.isObject(json2[key])) {
      result.push(`${secondFilePrefix}${key}${valueDelimiter}${iter(json2[key], depth + 1)}`);
    } else result.push(`${secondFilePrefix}${key}${valueDelimiter}${json2[key]}`);
  }

  return result.join('\n');
};

const makeDiff = (data1, data2) => {
  const iter = (currentData1, currentData2, depth) => {
    const sortedKeys = _.sortBy(_.union(Object.keys(currentData1), Object.keys(currentData2)));

    const diffArray = sortedKeys.reduce((acc, key) => {
      if (_.isObject(currentData1[key]) && _.isObject(currentData2[key])) {
        const currentIndent = '    '.repeat(depth);
        acc.push(`${currentIndent}${key}: ${iter(currentData1[key], currentData2[key], depth + 1)}`);
      } else {
        acc.push(genDiffString(currentData1, currentData2, key, depth));
      }
      return acc;
    }, []);
    const curIndent = '    '.repeat(depth - 1);
    return `{\u{000A}${diffArray.join('\n')}\u{000A}${curIndent}}`;
  };

  return iter(data1, data2, 1);
};

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  if (format !== 'stylish') return 'NEED FORMATER!';

  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'incorrect data';

  const [data1, data2] = parseFiles(fullPath1, fullPath2);
  return makeDiff(data1, data2);
};

export default gendiff;
