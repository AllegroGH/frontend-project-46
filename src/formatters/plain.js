import _ from 'lodash';

const addParent = (data, parent) => data.map(([key, value, status]) => [[parent, key].join('.'), value, status]);

const getPropertiesList = (array) => {
  const propertiesList = array.reduce((acc, [, status, key, value]) => {
    if (!_.isArray(value)) return [...acc, [key, value, status]];
    return [...acc, ...addParent(getPropertiesList(value), key)];
  }, []);

  return propertiesList;
};

// const getUpdated

// prettier-ignore
const getFilteredPropertiesList = (propertiesList) => {
  const ignoredStatus = ' ';
  const updatedStatus = 'updated';
  return propertiesList
    .map(([property, value, status], index, arr) => {
      const nextProperty = arr[index + 1] ? arr[index + 1][0] : undefined;
      const nextValue = nextProperty ? arr[index + 1][1] : undefined;
      const prevProperty = arr[index - 1] ? arr[index - 1][0] : undefined;

      if (property === nextProperty) return [property, [value, nextValue], updatedStatus];
      if (property === prevProperty) return [property, value, ignoredStatus];
      return [property, value, status];
    })
    .filter(([, , status]) => status !== ignoredStatus);
};

const getPlainValue = (value) => {
  if (typeof value === 'string') return `'${value}'`;
  if (_.isObject(value)) return '[complex value]';
  return value;
};

const getPlainLine = (property, value, status) => {
  const intro = `Property '${property}' was`;
  switch (status) {
    case '+':
      return `${intro} added with value: ${getPlainValue(value)}`;
    case '-':
      return `${intro} removed`;
    default: {
      const [fromValue, toValue] = value;
      return `${intro} updated. From ${getPlainValue(fromValue)} to ${getPlainValue(toValue)}`;
    }
  }
};

const plainFormatter = (array) => {
  const propertiesList = getPropertiesList(array);
  const filteredList = getFilteredPropertiesList(propertiesList);
  return filteredList.reduce((acc, [property, value, status]) => [...acc, getPlainLine(property, value, status)], []).join('\n');
};

export default plainFormatter;
