#!node

import fs from 'fs';
import path from 'path';
import { camelName } from './utils';

const arr = [];
const reg: RegExp = /.[png | svg | jpg | jpeg]/ig;

const basename = '\\assets';
let dartClass = `
class Images {
  {0}
}
`;


/**
 *
 * @param fileName 文件名
 * @param dirpath 文件所属的文件夹地址
 */

function readFile(fileName, dirpath) {
  const filePath = path.join(dirpath, fileName);
  const fileStats = fs.statSync(filePath);
  if (fileStats.isFile()) {
    if (reg.test(fileName)) {
      const name = fileName.substring(0, fileName.lastIndexOf('.'));
      const url = filePath.substring(filePath.indexOf(basename));
      arr.push(`static String ${camelName(name)} = '${url}';\n\t`);
    }
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

export function flutterImage(src) {
  console.log('flutter image start');
  const filePath = path.join(process.cwd(), src);
  readDir(filePath);
  let str = '';
  arr.forEach((r) => {
    str += r;
  });
  dartClass = dartClass.replace('{0}', str);
  fs.writeFileSync(`${filePath}/Images.dart`, dartClass.replace(/\\/g, '/'));
  console.log('flutter image end');
}
