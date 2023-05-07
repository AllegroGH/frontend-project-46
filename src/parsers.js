import { extname } from 'node:path';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const getFormat = (filepath1, filepath2) => {
  const format1 = extname(filepath1);
  const format2 = extname(filepath2);
  const jsonExtnames = ['.json'];
  const yamlExtnames = ['.yml', '.yaml'];

  if (jsonExtnames.includes(format1) && jsonExtnames.includes(format2)) return 'JSON';
  if (yamlExtnames.includes(format1) && yamlExtnames.includes(format2)) return 'YAML';
  return 'incorrect extensions';
};

const parseFiles = (filepath1, filepath2, format) => {
  const filesFormat = getFormat(filepath1, filepath2);
  if (!format && filesFormat === 'JSON') {
    const data1 = JSON.parse(readFileSync(filepath1, 'utf8'));
    const data2 = JSON.parse(readFileSync(filepath2, 'utf8'));
    return [data1, data2];
  }
  if (!format && filesFormat === 'YAML') {
    const data1 = yaml.load(readFileSync(filepath1, 'utf8'));
    const data2 = yaml.load(readFileSync(filepath2, 'utf8'));
    return [data1, data2];
  }
  return undefined;
};

export default parseFiles;
