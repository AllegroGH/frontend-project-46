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
const yamlPath1 = getFixturePath('file1.yml');
const yamlPath2 = getFixturePath('file2.yaml');
const expectedString = readFile('expected', 'utf8').trim();

const deepJsonPath1 = getFixturePath('deepFile1.json');
const deepJsonPath2 = getFixturePath('deepFile2.json');
const deepYamlPath1 = getFixturePath('deepFile1.yaml');
const deepYamlPath2 = getFixturePath('deepFile2.yml');
const deepExpectedString = readFile('expected_deep', 'utf8').trim();

test('gendiff flat JSON files', () => {
  expect(genDiff(jsonPath1, jsonPath2)).toEqual(expectedString);
});

test('gendiff flat YAML files', () => {
  expect(genDiff(yamlPath1, yamlPath2)).toEqual(expectedString);
});

test('gendiff deep JSON files', () => {
  expect(genDiff(deepJsonPath1, deepJsonPath2)).toEqual(deepExpectedString);
});

test('gendiff deep YAML files', () => {
  expect(genDiff(deepYamlPath1, deepYamlPath2)).toEqual(deepExpectedString);
});

test('FS errors', () => {
  expect(genDiff('1.json', '2.yaml')).toEqual('invalid filenames');
  expect(genDiff(getFixturePath('1'), getFixturePath('1'))).toEqual('wrong data');
});
