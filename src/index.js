import { cwd } from 'node:process';
import { resolve as pathResolve } from 'node:path';
import { existsSync } from 'node:fs';
import _ from 'lodash';
import parseFiles from './parsers.js';
import formatter from './formatters/index.js';

const getSortedKeysUnion = (obj1, obj2) => _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

const getDiffElems = (data1, data2, key, depth, bothDataEntry) => {
  const firstDataEntry = '-';
  const secondDataEntry = '+';

  if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key) && data1[key] === data2[key]) {
    return [[depth, bothDataEntry, key, data1[key]]];
  }
  const altResult = [];
  if (Object.hasOwn(data1, key)) altResult.push([depth, firstDataEntry, key, data1[key]]);
  if (Object.hasOwn(data2, key)) altResult.push([depth, secondDataEntry, key, data2[key]]);
  return altResult;
};

const makeDiff = (data1, data2) => {
  const bothDataEntry = ' ';
  const iter = (iterData1, iterData2, depth) => {
    const sortedKeys = getSortedKeysUnion(iterData1, iterData2);
    const diffArray = sortedKeys.reduce((acc, key) => {
      if (_.isObject(iterData1[key]) && _.isObject(iterData2[key])) {
        acc.push([depth, bothDataEntry, key, [...iter(iterData1[key], iterData2[key], depth + 1)]]);
        return acc;
      }
      acc.push(...getDiffElems(iterData1, iterData2, key, depth, bothDataEntry));
      return acc;
    }, []);
    return diffArray;
  };
  return iter(data1, data2, 1);
};

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (!(existsSync(fullPath1) && existsSync(fullPath2))) return 'invalid filenames';

  const [data1, data2] = parseFiles(fullPath1, fullPath2);
  if (!data1 || !data2) return 'wrong data';
  const diffStructure = makeDiff(data1, data2);
  const result = formatter(diffStructure, format);
  return result || 'wrong format';
};

export default gendiff;
