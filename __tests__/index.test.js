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
const deepExpected = readFile('expected_deep', 'utf8').trim();
const deepExpectedPlain = readFile('expected_plain', 'utf8').trim();
const deepExpectedJson = readFile('expected_json', 'utf8').trim();

test('gendiff flat files', () => {
  expect(genDiff(jsonPath1, jsonPath2)).toEqual(expectedString);
  expect(genDiff(yamlPath1, yamlPath2)).toEqual(expectedString);
});

test('gendiff deep files', () => {
  expect(genDiff(deepJsonPath1, deepJsonPath2)).toEqual(deepExpected);
  expect(genDiff(deepYamlPath1, deepYamlPath2)).toEqual(deepExpected);
});

test('gendiff deep files --format plain/json', () => {
  expect(genDiff(deepYamlPath1, deepJsonPath2, 'plain')).toEqual(deepExpectedPlain);
  expect(genDiff(deepJsonPath1, deepJsonPath2, 'json')).toEqual(deepExpectedJson);
});

test('FS and format errors', () => {
  expect(genDiff('1.json', '2.yaml')).toEqual('Error: file(s) does not exist');
  expect(genDiff(getFixturePath('1'), getFixturePath('2'))).toEqual('Error: wrong data');
  expect(genDiff(deepYamlPath1, deepJsonPath2, '123')).toEqual('Error: wrong format');
});
