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

const getFilteredPropertiesList = (propertiesList) => {
  const result = propertiesList
    .map(([property, value, symbol], index, arr) => {
      const nextProperty = arr[index + 1] ? arr[index + 1][0] : undefined;
      const prevProperty = arr[index - 1] ? arr[index - 1][0] : undefined;
      if (property === nextProperty) return [property, [value, arr[index + 1][1]], 'updated'];
      if (property === prevProperty) return [property, value, ' '];
      return [property, value, symbol];
    })
    .filter(([, , symbol]) => symbol !== ' ');
  return result;
};

const plainFormatter = (array) => {
  const propertiesList = getPropertiesList(array);
  const filteredList = getFilteredPropertiesList(propertiesList);
  return filteredList.reduce((acc, [property, value, symbol]) => [...acc, getPlainLine(property, value, symbol)], []).join('\n');
};

export default plainFormatter;
