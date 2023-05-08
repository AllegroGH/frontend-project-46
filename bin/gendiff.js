#!/usr/bin/env node
import { program } from 'commander';
import gendiff from '../src/index.js';

program.description('Compares two configuration files and shows a difference.');
program.version('0.0.1', '-V, --version', 'output the version number');

program.argument('<filepath1>');
program.argument('<filepath2>');
program.option('-f, --format <type>', 'output format', 'stylish');
program.action((filepath1, filepath2, options) => {
  const diffString = gendiff(filepath1, filepath2, options.format);
  console.log(diffString);
});

program.parse(process.argv);
