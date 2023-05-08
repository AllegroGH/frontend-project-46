import { extname } from 'node:path';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const getDataType = (filepath) => {
  const extName = extname(filepath);
  const jsonExtnames = ['.json'];
  const yamlExtnames = ['.yml', '.yaml'];

  if (jsonExtnames.includes(extName)) return 'JSON';
  if (yamlExtnames.includes(extName)) return 'YAML';
  return 'incorrect extension';
};

const parse = (filepath, dataType) => {
  if (dataType === 'JSON') return JSON.parse(readFileSync(filepath, 'utf8'));
  if (dataType === 'YAML') return yaml.load(readFileSync(filepath, 'utf8'));
  return undefined;
};

const parseFiles = (filepath1, filepath2) => {
  const data1 = parse(filepath1, getDataType(filepath1));
  const data2 = parse(filepath2, getDataType(filepath2));
  return [data1, data2];
};

export default parseFiles;
