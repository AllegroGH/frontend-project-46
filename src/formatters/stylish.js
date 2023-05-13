import _ from 'lodash';
// prettier-ignore
import {
  removedEntry, addedEntry, changedEntry, bothDataEntry,
} from '../build.js';

const space = ' ';
const spacesCount = 4;
const openingBracket = '{';
const closingBracket = '}';

const getPrefix = (status) => {
  switch (status) {
    case removedEntry:
      return '- ';
    case addedEntry:
      return '+ ';
    case bothDataEntry:
      return '  ';
    case changedEntry:
      return ['- ', '+ '];
    default:
      return undefined;
  }
};

const getStylishLine = (indent, prefix, key, value) => `${indent}${prefix}${key}: ${value}`;

const getStylishVal = (value, depth) => {
  if (!_.isObject(value)) return value;
  const curIndent = space.repeat(depth * spacesCount);
  const bracketIndent = space.repeat((depth - 1) * spacesCount);
  const lines = Object.entries(value).map(([key, val]) => {
    if (!_.isObject(val)) return getStylishLine(curIndent, '', key, val);
    return getStylishLine(curIndent, '', key, getStylishVal(val, depth + 1));
  });
  return [openingBracket, ...lines, `${bracketIndent}${closingBracket}`].join('\n');
};

const getNode = (indent, prefix, key, value, status, depth) => {
  if (status !== changedEntry) {
    return getStylishLine(indent, prefix, key, getStylishVal(value, depth));
  }
  const [firstPrefix, secondPrefix] = prefix;
  const [firstVal, secondVal] = value;
  return [getStylishLine(indent, firstPrefix, key, getStylishVal(firstVal, depth)), getStylishLine(indent, secondPrefix, key, getStylishVal(secondVal, depth))].join('\n');
};

const stylishFormatter = (array) => {
  // prettier-ignore
  const iter = (curArray) => curArray
    .reduce((acc, [depth, status, key, value]) => {
      const curPrefix = getPrefix(status);
      const curIndent = space.repeat(depth * spacesCount - 2);
      const curBracketIndent = space.repeat(depth * spacesCount);
      if (!_.isArray(value) || status === changedEntry) {
        return [...acc, getNode(curIndent, curPrefix, key, value, status, depth + 1)];
      }
      const rest = [getStylishLine(curIndent, curPrefix, key, openingBracket), iter(value), `${curBracketIndent}${closingBracket}`].join('\n');
      return [...acc, rest];
    }, [])
    .join('\n');
  return [openingBracket, iter(array), closingBracket].join('\n');
};

export default stylishFormatter;
