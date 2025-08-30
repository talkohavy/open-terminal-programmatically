import { execSync } from 'child_process';
import fs, { cpSync } from 'fs';
import os from 'os';
import path from 'path';

/**
 * @typedef {{
 *   version: string,
 *   private?: string | boolean,
 *   main: string,
 *   type: 'module' | 'commonjs'
 *   types: string,
 *   scripts?: Record<string, string>,
 *   publishConfig: {
 *     access: string
 *   },
 *   devDependencies?: Record<string, string>,
 * }} PackageJson
 */

const ROOT_PROJECT = process.cwd();
const outDirName = 'dist';
const COLORS = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  stop: '\x1b[39m',
};

buildPackageConfig();

async function buildPackageConfig() {
  const startTime = Date.now();

  cleanTargetDirectory(outDirName);

  build();

  copyStaticFiles(outDirName);

  manipulatePackageJsonFile(outDirName); // <--- must come AFTER copy of static files

  printDoneMessage(startTime);
}

/**
 * @param {string} outDirName
 */
function cleanTargetDirectory(outDirName) {
  console.log(`${COLORS.green}- Step 1:${COLORS.stop} clear the ${outDirName} directory`);
  const deleteCommand = os.platform() === 'win32' ? `rd /s /q ${outDirName}` : `rm -rf ${outDirName}`;

  execSync(deleteCommand);

  console.log('');
}

function build() {
  console.log(`${COLORS.green}- Step 2:${COLORS.stop} build`);
  execSync('rollup --config'); // or the full command: rollup --config rollup.config.mjs

  console.log('');
}

/**
 * @param {string} outDirName
 */
function copyStaticFiles(outDirName) {
  console.log(`${COLORS.green}- Step 3:${COLORS.stop} copy static files`);

  const filesToCopyArr = [
    { filename: 'package.json', sourceDirPath: [], destinationDirPath: [] },
    { filename: 'README.md', sourceDirPath: [], destinationDirPath: [] },
    { filename: '.npmrc', sourceDirPath: [], destinationDirPath: [], isAllowedToFail: true },
    { filename: '.npmignore', sourceDirPath: [], destinationDirPath: [], isAllowedToFail: true },
  ];

  filesToCopyArr.forEach(({ filename, sourceDirPath, destinationDirPath, isAllowedToFail }) => {
    try {
      const sourceFileFullPath = path.resolve(ROOT_PROJECT, ...sourceDirPath, filename);
      const destinationFileFullPath = path.resolve(ROOT_PROJECT, outDirName, ...destinationDirPath, filename);

      cpSync(sourceFileFullPath, destinationFileFullPath);
      console.log(`\t• ${COLORS.blue}${filename}${COLORS.stop}`);
    } catch (error) {
      if (isAllowedToFail) return;

      console.error(error);

      throw new Error('File MUST exists in order to PASS build process! cp operation failed...');
    }
  });

  console.log('');
}

/**
 * @param {string} outDirName
 */
function manipulatePackageJsonFile(outDirName) {
  console.log(`${COLORS.green}- Step 4:${COLORS.stop} copy & manipulate the package.json file`);

  const packageJsonPath = path.resolve(ROOT_PROJECT, outDirName, 'package.json');

  // Step: get the original package.json file
  /** @type {PackageJson} */
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  delete packageJson.private;
  delete packageJson.scripts;
  delete packageJson.devDependencies;
  packageJson.publishConfig.access = 'public';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

  console.log(`\t• ${COLORS.blue}deleted${COLORS.stop} "private" key`);
  console.log(`\t• ${COLORS.blue}deleted${COLORS.stop} "scripts" key`);
  console.log(`\t• ${COLORS.blue}deleted${COLORS.stop} "devDependencies" key`);
  console.log(`\t• ${COLORS.blue}changed${COLORS.stop} publishConfig access to public`);

  console.log(`📝 ${COLORS.magenta}package.json${COLORS.stop} file written successfully!`);

  console.log('');
}

/**
 * @param {number} startTime in milliseconds
 */
function printDoneMessage(startTime) {
  const endTime = Date.now();
  const elapsedMs = endTime - startTime;
  let elapsedTimeMessage;

  if (elapsedMs >= 1000) {
    const elapsedSec = (elapsedMs / 1000).toFixed(2);
    elapsedTimeMessage = `${elapsedSec} sec`;
  } else {
    elapsedTimeMessage = `${elapsedMs} ms`;
  }

  const doneMessage = `✨Done in ${elapsedTimeMessage} ✅`;

  console.log(COLORS.green, doneMessage, COLORS.stop, os.EOL);
}
