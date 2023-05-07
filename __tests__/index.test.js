import { fileURLToPath } from 'node:url';
import { dirname, join as pathjoin } from 'node:path';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => pathjoin(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const jsonPath1 = getFixturePath('file1.json');
const jsonPath2 = getFixturePath('file2.json');
const jsonExpected = readFile('expected_json', 'utf8').trim();

test('gendiff flat json files', () => {
  expect(genDiff(jsonPath1, jsonPath2)).toEqual(jsonExpected);
});
