import { extname } from 'node:path';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const getDataType = (filepath) => {
  const extName = extname(filepath);
  const jsonExtnames = ['.json'];
  const yamlExtnames = ['.yml', '.yaml'];

  if (jsonExtnames.includes(extName)) return 'JSON';
  if (yamlExtnames.includes(extName)) return 'YAML';
  return undefined;
};

const parseFile = (filepath) => {
  const dataType = getDataType(filepath);
  if (dataType === 'JSON') return JSON.parse(readFileSync(filepath, 'utf8'));
  if (dataType === 'YAML') return yaml.load(readFileSync(filepath, 'utf8'));
  return undefined;
};

export default parseFile;
