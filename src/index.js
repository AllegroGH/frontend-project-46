import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import _ from 'lodash';
import parseFiles from './parsers.js';

/*
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
*/
/*
const formater1 = (data, key, depth, symbol) => {
  const spacesCount = 4;
  const prefix = `${symbol} `;
  const indent = ' '.repeat(depth * spacesCount - 2);

  const iter = (currentData, currentKey, currentDepth) => {
    const currentIndent = ' '.repeat(currentDepth * spacesCount - 2);
    if (!_.isObject(currentData)) return `${currentIndent}${prefix}${currentKey}: ${currentData[currentKey]}`;

    const subKeys = _.sortBy(Object.keys(currentValue));
    const result = subKeys.reduce((acc, subKey) => {
      if (_.isObject(currentData[subKey])) {
        acc.push(`${currentIndent}${subKey}: ${iter(currentData[subKey], currentDepth + 1)}`);
      } else {
        acc.push(`${currentIndent}${subKey}: ${currentData[subKey]}`);
      }
      return acc;
    }, []);

    const bracketIndent = ' '.repeat(spacesCount * (currentDepth - 1));
    return `{\u{000A}${result.join('\n')}\u{000A}${bracketIndent}}`;
  };

  return iter(value, key, depth);
};
*/

/*
const result = keys111
  .map((key) => {
    return formater(data111, key, 1, '+');
  })
  .join('\n');
console.log(result);*/

const getSortedKeysUnion = (obj1, obj2) => _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

const getKeyPresence = (obj1, obj2, key) => {
  if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key) && obj1[key] === obj2[key]) return 'both =';
  if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key) && obj1[key] !== obj2[key]) return 'both !=';
  if (Object.hasOwn(obj1, key)) return 'only first';
  if (Object.hasOwn(obj2, key)) return 'only second';
  return undefined;
};

const makeDiff = (data1, data2) => {
  const entryFirstData = '-';
  const entrySecondData = '+';
  const entryBothData = ' ';
  const iter = (iterData1, iterData2, depth) => {
    const sortedKeys = getSortedKeysUnion(iterData1, iterData2);
    const diffArray = sortedKeys.reduce((acc, key) => {
      if (_.isObject(iterData1[key]) && _.isObject(iterData2[key])) {
        acc.push([depth, entryBothData, key, [...iter(iterData1[key], iterData2[key], depth + 1)]]);
        return acc;
      }
      const keyPresenceInfo = getKeyPresence(iterData1, iterData2, key);
      if (keyPresenceInfo === 'both =') acc.push([depth, entryBothData, key, iterData1[key]]);
      if (keyPresenceInfo === 'both !=') {
        acc.push([depth, entryFirstData, key, iterData1[key]]);
        acc.push([depth, entrySecondData, key, iterData2[key]]);
      }
      if (keyPresenceInfo === 'only first') acc.push([depth, entryFirstData, key, iterData1[key]]);
      if (keyPresenceInfo === 'only second') acc.push([depth, entrySecondData, key, iterData2[key]]);
      return acc;
    }, []);
    return diffArray;
  };
  return iter(data1, data2, 1);
};

const formater = (array) => {
  const spacesCount = 4;

  const iter = (curArray) => {
    const result = curArray.reduce((acc, [depth, symbol, key, value]) => {
      const curPrefix = `${symbol} `;
      const curIndent = ' '.repeat(depth * spacesCount - 2);
      const curBracketIndent = ' '.repeat((depth - 1) * spacesCount);
      if (!_.isArray(value)) {
        acc.push(`${curIndent}${curPrefix}${key}: ${value}`);
        return acc;
      }
      // acc.push(`${curIndent}${curPrefix}${key}: {\u{000A}${iter(value)}{\u{000A}${curBracketIndent}}`);
      acc.push(`${curIndent}${curPrefix}${key}: ${iter(value)}`); // add foo!!!!!
      return acc;
    }, []);
    return result.join('\n');
  };

  return iter(array);
};

import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
const dataX1 = yaml.load(readFileSync('deepFile1.yaml', 'utf8'));
const dataX2 = yaml.load(readFileSync('deepFile2.yml', 'utf8'));

const mDiff = makeDiff(dataX1, dataX2);
console.log(formater(mDiff));

/*
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
*/
const gendiff = (filepath1, filepath2, format = 'stylish') => {
  if (format !== 'stylish') return 'NEED FORMATER!';

  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'incorrect data';

  const [data1, data2] = parseFiles(fullPath1, fullPath2);
  const diffStructure = makeDiff(data1, data2);
  return diffStructure;
};

export default gendiff;
