import _ from 'lodash';

const removedEntry = 'removed';
const addedEntry = 'added';
const changedEntry = 'changed';
const bothDataEntry = 'both';

const getSortedKeysUnion = (obj1, obj2) => _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

const getDiffElement = (data1, data2, key, depth) => {
  if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
    if (data1[key] === data2[key]) return [depth, bothDataEntry, key, data1[key]];
    return [depth, changedEntry, key, [data1[key], data2[key]]];
  }
  if (Object.hasOwn(data1, key)) return [depth, removedEntry, key, data1[key]];
  return [depth, addedEntry, key, data2[key]];
};

const buildDiff = (data1, data2) => {
  const iter = (iterData1, iterData2, depth) => {
    const sortedKeys = getSortedKeysUnion(iterData1, iterData2);
    const diffArray = sortedKeys.reduce((acc, key) => {
      if (_.isObject(iterData1[key]) && _.isObject(iterData2[key])) {
        // prettier-ignore
        return [
          ...acc,
          [depth, bothDataEntry, key, [...iter(iterData1[key], iterData2[key], depth + 1)]],
        ];
      }
      return [...acc, getDiffElement(iterData1, iterData2, key, depth)];
    }, []);
    return diffArray;
  };
  return iter(data1, data2, 1);
};

// prettier-ignore
export {
  buildDiff, removedEntry, addedEntry, changedEntry, bothDataEntry,
};
