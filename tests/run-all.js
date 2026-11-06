/**
 * Universal Test Runner for Aggarwal Agencies
 * Recursively discovers and executes all *.test.js files across platforms.
 */

const { run } = require('node:test');
const { spec } = require('node:test/reporters');
const path = require('node:path');
const fs = require('node:fs');

function findTestFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findTestFiles(fullPath));
    } else if (file.endsWith('.test.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = findTestFiles(__dirname);

run({ files })
  .on('test:fail', () => {
    process.exitCode = 1;
  })
  .compose(new spec())
  .pipe(process.stdout);
