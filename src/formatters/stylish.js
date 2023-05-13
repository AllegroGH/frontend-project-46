import _ from 'lodash';

const space = ' ';
const spacesCount = 4;
const openingBracket = '{';
const closingBracket = '}';

const getStylishValue = (value, depth) => {
  if (!_.isObject(value)) return value;
  const curIndent = space.repeat(depth * spacesCount);
  const bracketIndent = space.repeat((depth - 1) * spacesCount);
  const lines = Object.entries(value).map(([key, val]) => {
    if (!_.isObject(val)) return `${curIndent}${key}: ${val}`;
    return `${curIndent}${key}: ${getStylishValue(val, depth + 1, spacesCount)}`;
  });
  return [openingBracket, ...lines, `${bracketIndent}${closingBracket}`].join('\n');
};

const stylishFormatter = (array) => {
  const iter = (curArray) => {
    const lines = curArray.reduce((acc, [depth, status, key, value]) => {
      const curPrefix = `${status} `;
      const curIndent = space.repeat(depth * spacesCount - 2);
      const curBracketIndent = space.repeat(depth * spacesCount);
      if (!_.isArray(value)) acc.push(`${curIndent}${curPrefix}${key}: ${getStylishValue(value, depth + 1)}`);
      else acc.push([`${curIndent}${curPrefix}${key}: ${openingBracket}`, iter(value), `${curBracketIndent}${closingBracket}`].join('\n'));
      return acc;
    }, []);
    return lines.join('\n');
  };

  return [openingBracket, iter(array), closingBracket].join('\n');
};

export default stylishFormatter;
