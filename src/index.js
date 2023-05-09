import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import _ from 'lodash';
import parseFiles from './parsers.js';

const getSortedKeysUnion = (obj1, obj2) => _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

const getDiffElems = (obj1, obj2, key, depth) => {
  const firstFileSymbol = '-';
  const secondFileSymbol = '+';
  const bothFilesSymbol = ' ';

  if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key) && obj1[key] === obj2[key]) {
    return [[depth, bothFilesSymbol, key, obj1[key]]];
  }
  const altResult = [];
  if (Object.hasOwn(obj1, key)) altResult.push([depth, firstFileSymbol, key, obj1[key]]);
  if (Object.hasOwn(obj2, key)) altResult.push([depth, secondFileSymbol, key, obj2[key]]);
  return altResult;
};

const makeDiff = (data1, data2) => {
  const entryBothData = ' ';
  const iter = (iterData1, iterData2, depth) => {
    const sortedKeys = getSortedKeysUnion(iterData1, iterData2);
    const diffArray = sortedKeys.reduce((acc, key) => {
      if (_.isObject(iterData1[key]) && _.isObject(iterData2[key])) {
        acc.push([depth, entryBothData, key, [...iter(iterData1[key], iterData2[key], depth + 1)]]);
        return acc;
      }
      acc.push(...getDiffElems(iterData1, iterData2, key, depth));
      return acc;
    }, []);
    return diffArray;
  };
  return iter(data1, data2, 1);
};

const formater = (array) => {
  const spacesCount = 4;

  const addValueIter = (value, depth) => {
    if (!_.isObject(value)) return value;
    const curIndent = ' '.repeat(depth * spacesCount);
    const bracketIndent = ' '.repeat((depth - 1) * spacesCount);
    const lines = Object.entries(value).map(([key, val]) => {
      if (!_.isObject(val)) return `${curIndent}${key}: ${val}`;
      return `${curIndent}${key}: ${addValueIter(val, depth + 1)}`;
    });
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  const mainIter = (curArray) => {
    const result = curArray.reduce((acc, [depth, symbol, key, value]) => {
      const curPrefix = `${symbol} `;
      const curIndent = ' '.repeat(depth * spacesCount - 2);
      const curBracketIndent = ' '.repeat(depth * spacesCount);
      if (!_.isArray(value)) {
        acc.push(`${curIndent}${curPrefix}${key}: ${addValueIter(value, depth + 1)}`);
        return acc;
      }
      acc.push([`${curIndent}${curPrefix}${key}: {`, mainIter(value), `${curBracketIndent}}`].join('\n'));
      return acc;
    }, []);
    return result.join('\n');
  };

  return ['{', mainIter(array), '}'].join('\n');
};

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  if (format !== 'stylish') return 'NEED FORMATER!';

  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'incorrect data';

  const [data1, data2] = parseFiles(fullPath1, fullPath2);
  const diffStructure = makeDiff(data1, data2);
  return formater(diffStructure);
};

export default gendiff;
