#!/usr/bin/env node

import { Cli } from '@cucumber/cucumber';

const passthruArgs = process.argv.slice(2);

let consumerPathArg;
let featureFilePathDetected = false;

const filteredArgs = [];
for (let i = 0; i < passthruArgs.length; i++) {
    const arg = passthruArgs[i];
    if (arg === '--cpPath') {
        // A chatpickle project parameter to help developers run examples while developing chatpickle
        consumerPathArg = passthruArgs[i + 1];
        i++;
        continue;
    }
    // if argument is  parameterized
    if (arg[0] === '-') {
        filteredArgs.push(arg);
        if (i + 1 < passthruArgs.length) {
            filteredArgs.push(passthruArgs[i + 1]);
            i++;
        }
        continue;
    } else {
        // Cucumber considers any non-parameterized arguments to be alternate locations of feature files
        // If we detect this type of argument, don't hardcode the chatpickle path as a feature file location
        featureFilePathDetected = true;
        filteredArgs.push(arg);
    }
}

process.env.CHATPICKLE_CONSUMER_PATH_ABSOLUTE = consumerPathArg ? `${process.cwd()}/${consumerPathArg}` : process.cwd();

const runArgs = [null, '', ...filteredArgs, '--require', `${__dirname}/cucumberSupport`];

const featureFilePath = featureFilePathDetected ? null : `${consumerPathArg || ''}chatpickle`;

if (featureFilePath) {
    runArgs.push(featureFilePath);
}

const cliArgs = { argv: runArgs, cwd: process.cwd(), stdout: process.stdout, stderr: process.stderr, env: process.env };
const cli = new Cli(cliArgs);

cli.run()
    .then((result) => {
        if (result.success) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
