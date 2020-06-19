#!node

import fs from 'fs';
import path from 'path';
import { camelName } from './utils';

const arr = [];

const basename = path.basename(__dirname);

/**
 *
 * @param fileName 文件名
 * @param dirpath 文件所属的文件夹地址
 */

function readFile(fileName, dirpath) {
  if (fileName === 'index.js') {
    return;
  }
  const filePath = path.join(dirpath, fileName);
  const fileStats = fs.statSync(filePath);
  if (fileStats.isFile()) {
    const name = fileName.substring(0, fileName.lastIndexOf('.'));
    const url = filePath.substring(filePath.indexOf(basename));
    arr.push(`static String ${camelName(name)} = '${url}';\n\t`);
  } else {
    // eslint-disable-next-line no-use-before-define
    readDir(filePath);
  }
}

function readDir(dirName) {
  const fileNames = fs.readdirSync(dirName, { encoding: 'utf-8' });
  fileNames.forEach((fileName) => {
    readFile(fileName, dirName);
  });
}

readDir(__dirname);

let dartClass = 'class Images {\n\t';
arr.forEach((r) => {
  dartClass += r;
});
dartClass += '\n}';

fs.writeFileSync(`${__dirname}/Images.dart`, dartClass.replace(/\\/g, '/'));
