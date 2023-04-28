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

const jsonDiff = (filepath1, filepath2) => {
  const fullPath1 = pathResolve(cwd(), filepath1);
  const fullPath2 = pathResolve(cwd(), filepath2);

  if (existsSync(fullPath1) && existsSync(fullPath2)) {
    const jsonFile1 = JSON.parse(readFileSync(fullPath1, 'utf8'));
    const jsonFile2 = JSON.parse(readFileSync(fullPath2, 'utf8'));
    const keysFile1 = Object.keys(jsonFile1);
    const keysFile2 = Object.keys(jsonFile2);
    const firstFilePrefix = '  - ';
    const secondFilePrefix = '  + ';
    const bothFilesPrefix = '    ';

    const diffArr = keysFile1.reduce((acc, key) => {
      if (keysFile2.includes(key)) {
        if (jsonFile1[key] === jsonFile2[key]) {
          acc.push([bothFilesPrefix, key, jsonFile1[key]]);
        } else {
          acc.push([firstFilePrefix, key, jsonFile1[key]]);
          acc.push([secondFilePrefix, key, jsonFile2[key]]);
        }
      } else acc.push([firstFilePrefix, key, jsonFile1[key]]);
      return acc;
    }, []);

    const fullDiffArr = keysFile2.reduce(
      (acc, key) => {
        if (!keysFile1.includes(key)) acc.push([secondFilePrefix, key, jsonFile2[key]]);
        return acc;
      },
      [...diffArr],
    );

    const sortedDiffArr = _.sortBy(
      _.sortBy(fullDiffArr, ([prefix]) => prefix !== '  - '),
      ([, key]) => key,
    );

    const result = sortedDiffArr
      .reduce(
        (acc, [prefix, key, value]) => {
          acc.push(`${prefix}${key}: ${value}`);
          acc.push('\n');
          return acc;
        },
        ['{\n'],
      )
      .join('');
    return `${result}}`;
  }
  return 'Incorrect data';
};

const genDiff = (filepath1, filepath2, format) => {
  if (!format) {
    if (getFormat(filepath1, filepath2) === '.json') {
      return jsonDiff(filepath1, filepath2);
    }
  }
  return undefined;
};

export default genDiff;
