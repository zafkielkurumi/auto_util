import fs from 'fs';
import path from 'path';
import { camelize } from './utils';

const arr = [];
const arr1 = [];
const reg: RegExp = /\.(png|svg|jpg|jpeg|gif)$/;

const basename = '\\assets';
let imageStr = `// GENERATED CODE - DO NOT MODIFY MANUALLY
// **************************************************************************
// Auto generated by c
// **************************************************************************

{0}

export const Images = {
  {1}
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
      arr.push(`import ${camelize(name)} from '@${url}';`);
      arr1.push(camelize(name));
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

export function reactImage(src) {
  console.log('react image start');
  const filePath = path.join(process.cwd(), src);
  readDir(filePath);
  imageStr = imageStr.replace('{0}', arr.join('\n'));
  imageStr = imageStr.replace('{1}', arr1.join(',\n\t'));
  fs.writeFileSync(`${process.cwd()}/src/constants/Images.ts`, imageStr.replace(/\\/g, '/'));
  console.log('react image end');
}
