import _ from 'lodash';

const addParent = (data, parent) => data.map(([key, value, symbol]) => [[parent, key].join('.'), value, symbol]);

const getPlainValue = (value) => {
  if (typeof value === 'string') return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const getPlainLine = (property, value, symbol) => {
  const intro = `Property '${property}' was`;
  switch (symbol) {
    case '+':
      return `${intro} added with value: ${getPlainValue(value)}`;
    case '-':
      return `${intro} removed`;
    case 'updated':
      return `${intro} updated. From ${getPlainValue(value[0])} to ${getPlainValue(value[1])}`;
    default:
      return '';
  }
};

const getPropertiesList = (array) => {
  const propertiesList = array.reduce((acc, [, symbol, key, value]) => {
    if (!_.isArray(value)) return [...acc, [key, value, symbol]];
    return [...acc, ...addParent(getPropertiesList(value), key)];
  }, []);

  return propertiesList;
};

const plainFormatter = (array) => {
  const propertiesList = getPropertiesList(array);
  const filteredList = propertiesList
    .map(([property, value, symbol], index, arr) => {
      if (arr[index + 1] && property === arr[index + 1][0]) return [property, [value, arr[index + 1][1]], 'updated'];
      if (arr[index - 1] && property === arr[index - 1][0]) return [property, value, ' '];
      return [property, value, symbol];
    })
    .filter(([, , symbol]) => symbol !== ' ');
  return filteredList.reduce((acc, [property, value, symbol]) => [...acc, getPlainLine(property, value, symbol)], []).join('\n');
};

export default plainFormatter;
