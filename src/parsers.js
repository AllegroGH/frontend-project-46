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

const parse = (filepath, format) => {
  if (format === 'JSON') return JSON.parse(readFileSync(filepath, 'utf8'));
  if (format === 'YAML') return yaml.load(readFileSync(filepath, 'utf8'));
  return undefined;
};

const parseFiles = (filepath1, filepath2, format) => {
  const filesFormat = format || getFormat(filepath1, filepath2);
  const data1 = parse(filepath1, filesFormat);
  const data2 = parse(filepath2, filesFormat);
  return [data1, data2];
};

export default parseFiles;
