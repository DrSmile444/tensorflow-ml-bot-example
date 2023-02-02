/* eslint-disable unicorn/no-process-exit */
import fs from 'node:fs';

const txtFilePath = `${__dirname}/temp/vocab`;
const jsonFilePath = `${__dirname}/temp/vocab.json`;

if (!fs.existsSync(txtFilePath)) {
  console.error(`!!!ERROR!!!\nThere is no file 'vocab' file in the temp folder. Add it here, please:\n- ${txtFilePath}`);
  process.exit(1);
}

const vocabTxt = fs.readFileSync(txtFilePath).toString();
const vocabJson = vocabTxt
  .trim()
  .split('\n')
  .map((row) => row.split(' ')[0]);

fs.writeFileSync(jsonFilePath, JSON.stringify(vocabJson, null, 2));

console.info(`!!!SUCCESS!!!\n'vocab' file has been converted:\n- ${jsonFilePath}`);
