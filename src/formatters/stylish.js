import _ from 'lodash';

const getStylishValue = (value, depth, spacesCount) => {
  if (!_.isObject(value)) return value;
  const curIndent = ' '.repeat(depth * spacesCount);
  const bracketIndent = ' '.repeat((depth - 1) * spacesCount);
  const lines = Object.entries(value).map(([key, val]) => {
    if (!_.isObject(val)) return `${curIndent}${key}: ${val}`;
    return `${curIndent}${key}: ${getStylishValue(val, depth + 1, spacesCount)}`;
  });
  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const stylishFormatter = (array) => {
  const spacesCount = 4;
  const iter = (curArray) => {
    const lines = curArray.reduce((acc, [depth, symbol, key, value]) => {
      const curPrefix = `${symbol} `;
      const curIndent = ' '.repeat(depth * spacesCount - 2);
      const curBracketIndent = ' '.repeat(depth * spacesCount);
      if (!_.isArray(value)) {
        acc.push(`${curIndent}${curPrefix}${key}: ${getStylishValue(value, depth + 1, spacesCount)}`);
        return acc;
      }
      acc.push([`${curIndent}${curPrefix}${key}: {`, iter(value), `${curBracketIndent}}`].join('\n'));
      return acc;
    }, []);
    return lines.join('\n');
  };

  return ['{', iter(array), '}'].join('\n');
};

export default stylishFormatter;
