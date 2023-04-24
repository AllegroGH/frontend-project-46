#!/usr/bin/env node

// const { Command } = require('commander');
// const program = new Command();

import { program } from 'commander';

program.description(`Compares two configuration files and shows a difference.`);
program.option('-V, --version', 'output the version number');

/* program.addHelpText(
  'after',
  `
Example call:
  $ custom-help --help`
); */

program.parse(process.argv);
