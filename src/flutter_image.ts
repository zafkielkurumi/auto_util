#!node

import fs from 'fs';
import path from 'path';
import { camelize } from './utils';

const arr = [];
const reg: RegExp = /\.(png|svg|jpg|jpeg|gif)$/ig;

const basename = '\\assets';
let dartClass = `
// GENERATED CODE - DO NOT MODIFY MANUALLY
// **************************************************************************
// Auto generated by c
// **************************************************************************

class Images {
  {0}
}
`;

/**
 *
 * @param fileName 文件名
 * @param dirpath 文件所属的文件夹地址
 */

function readFile(fileName: string, dirpath: string) {
  const filePath = path.join(dirpath, fileName);
  const fileStats = fs.statSync(filePath);
  if (fileStats.isFile()) {
    console.log(reg.test(fileName), 'fileName');
    const isImg = reg.test(filePath);
    if (isImg) {
      console.log(filePath, 'filePath');
      const [_, file]: string[] = filePath.split(`${basename}\\images`);
      const tempName = file.substring(0, file.lastIndexOf('.'));
      const name = camelize(tempName.replaceAll('@', '').replaceAll('\\', ' '));
      const url = filePath.substring(filePath.indexOf(basename));
      arr.push(`static String ${camelize(name)} = '${url}';\n\t`);
    }
  } else {
    // eslint-disable-next-line no-use-before-define
    readDir(filePath);
  }
}

function readDir(dirName: string) {
  const fileNames = fs.readdirSync(dirName, { encoding: 'utf-8' });
  fileNames.forEach((fileName) => {
    readFile(fileName, dirName);
  });
}

export function flutterImage(src: string) {
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
