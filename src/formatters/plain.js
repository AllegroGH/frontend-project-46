import _ from 'lodash';
// prettier-ignore
import {
  removedEntry, addedEntry, changedEntry, bothDataEntry,
} from '../build.js';

const addParent = (data, parent) => data.map(([key, value, status]) => [[parent, key].join('.'), value, status]);

const getPropertiesList = (array) => {
  const propertiesList = array.reduce((acc, [, status, key, value]) => {
    if (!_.isArray(value) || status === changedEntry) return [...acc, [key, value, status]];
    return [...acc, ...addParent(getPropertiesList(value), key)];
  }, []);

  return propertiesList;
};

const getFormattedValue = (value) => {
  if (typeof value === 'string') return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const getPlainLine = (property, value, status) => {
  const intro = `Property '${property}' was`;
  switch (status) {
    case addedEntry:
      return `${intro} added with value: ${getFormattedValue(value)}`;
    case removedEntry:
      return `${intro} removed`;
    case changedEntry: {
      const [fromValue, toValue] = value;
      return `${intro} updated. From ${getFormattedValue(fromValue)} to ${getFormattedValue(toValue)}`;
    }
    default:
      return undefined;
  }
};

// prettier-ignore
const plainFormatter = (array) => getPropertiesList(array)
  .filter(([, , status]) => status !== bothDataEntry)
  .reduce((acc, [property, value, status]) => [...acc, getPlainLine(property, value, status)], [])
  .join('\n');

export default plainFormatter;
