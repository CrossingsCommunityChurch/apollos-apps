#!/usr/bin/env node

import { dirname } from 'path';

import { fileURLToPath } from 'url';

import util from 'util';
import { exec as baseExec } from 'child_process';
import prompts from 'prompts';
import { execa } from 'execa';
import { program } from 'commander';

const exec = util.promisify(baseExec);

const __dirname = dirname(fileURLToPath(import.meta.url));

program.version('1.0.0');

// create
program
  .name('apollos')
  .command('create')
  .description('Generate new Apollos projects')
  .command('mobile')
  .description('Generate new Apollos mobile app')
  .action(() => {
    const questions = [
      {
        type: 'text',
        name: 'appName',
        message: 'App name?',
      },
      {
        type: 'text',
        name: 'iosID',
        message: 'iOS Bundle Identifier?',
        initial: (prev) =>
          `com.apollos.${prev.toLowerCase().replace(/ /g, '_')}`,
        validate: (value) =>
          value.match(/\w.]+/)[0] === value
            ? true
            : `Alphanumeric and underscores only!`,
      },
      {
        type: 'text',
        name: 'androidID',
        message: 'Android App ID?',
        initial: (prev) => prev,
        validate: (value) =>
          value.match(/[\w.]+/)[0] === value
            ? true
            : `Alphanumeric and underscores only!`,
      },
    ];

    (async () => {
      const response = await prompts(questions);
      if (Object.keys(response).length === 3) {
        try {
          execa(`${__dirname}/scripts/create-mobile.sh`, [
            response.appName,
            response.iosID,
            response.androidID,
          ]).stdout.pipe(process.stdout);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  });

program
  .command('secrets')
  .description("Decrypt or encrypt your app's secrets")
  .argument('<password>')
  .option('-d', 'decrypt shared files')
  .option('-e', 'encrypt shared files')
  .action((password, options) => {
    if ((options.d && options.e) || (!options.d && !options.e))
      console.error('Must use either -e or -d, not both');
    if (options.d) {
      exec(`${__dirname}/scripts/secrets.sh -d ${password}`).then(
        ({ stdout, stderr }) => {
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.log(stderr);
          }
        }
      );
    }
    if (options.e) {
      exec(`${__dirname}/scripts/secrets.sh -e ${password}`).then(
        ({ stdout, stderr }) => {
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.log(stderr);
          }
        }
      );
    }
  });

program.parse();
