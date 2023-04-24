#!/usr/bin/env node

// const { Command } = require('commander');
// const program = new Command();

import { program } from 'commander';

program.description(`Compares two configuration files and shows a difference.`);
//program.option('-V, --version', 'output the version number');
program.version('0.0.1', '-V, --version', 'output the version number');
program.option('-f, --format <type>', 'output format');

program.argument('<filepath1>'); //, 'path to first file');
program.argument('<filepath2>'); // , 'path to second file');

/* program.addHelpText(
  'after',
  `
Example call:
  $ custom-help --help`
); */

program.parse(process.argv);
