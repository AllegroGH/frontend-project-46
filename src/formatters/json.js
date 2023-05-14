import _ from 'lodash';
import { changedEntry } from '../build.js';

const space = ' ';
const spacesCount = 2;
const openingBracket = '{';
const closingBracket = '}';
const trailingSymbol = ',';
const joinSubString = '\\n';

const getFormattedValue = (value) => {
  if (typeof value === 'string') return `\\"${value}\\"`;
  return value;
};

const getJsonLine = (indent, key, value, trailing) => `${indent}\\"${key}\\": ${value}${trailing}`;

const getJsonVal = (value, depth) => {
  if (!_.isObject(value)) return getFormattedValue(value);
  const childIndent = space.repeat((depth + 1) * spacesCount);
  const bracketIndent = space.repeat(depth * spacesCount);
  const lines = Object.entries(value).map(([key, val], curIndex, curElement) => {
    const trailing = curIndex < curElement.length - 1 ? trailingSymbol : '';
    if (!_.isObject(val)) return getJsonLine(childIndent, key, getFormattedValue(val), trailing);
    return getJsonLine(childIndent, key, getJsonVal(val, depth + 1), trailing);
  });
  return [openingBracket, ...lines, `${bracketIndent}${closingBracket}`].join(joinSubString);
};

const getChangedVal = ([fromValue, toValue], depth) => `[${getJsonVal(fromValue, depth)}, ${getJsonVal(toValue, depth)}]`;

const getJsonLeaf = (depth, key, value, status, trailing) => {
  const keyIndent = space.repeat(depth * spacesCount);
  const childsIndent = space.repeat((depth + 1) * spacesCount);
  return [
    `${keyIndent}\\"${key}\\": ${openingBracket}`,
    `${childsIndent}\\"status\\": \\"${status}\\",`,
    `${childsIndent}\\"value\\": ${value}`,
    `${keyIndent}${closingBracket}${trailing}`,
  ].join(joinSubString);
};

const jsonFormatter = (array) => {
  // prettier-ignore
  const iter = (curArray, depthIncrement = 0) => curArray
    .reduce((acc, [depth, status, key, value], curIndex, curElement) => {
      const childsIndent = space.repeat((depth + 1 + depthIncrement) * spacesCount);
      const trailing = curIndex < (curElement.length - 1) ? trailingSymbol : '';
      if (!_.isArray(value) || status === changedEntry) {
        const curValue = status === changedEntry
          ? getChangedVal(value, depth + depthIncrement + 1)
          : getJsonVal(value, depth + depthIncrement + 1);
        return [...acc, getJsonLeaf(depth + depthIncrement, key, curValue, status, trailing)];
      }
      const node = [openingBracket, iter(value, depthIncrement + 1), `${childsIndent}${closingBracket}`].join(joinSubString);
      return [...acc, getJsonLeaf(depth + depthIncrement, key, node, status, trailing)];
    }, [])
    .join(joinSubString);

  return [openingBracket, iter(array), closingBracket, ''].join(joinSubString);
};

export default jsonFormatter;
