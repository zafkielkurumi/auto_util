import path from 'path';
import fs from 'fs';
import { camelName } from './utils';

const reg = /pages[a-z | A-z]*Package/;
let routesConfig = '';
let routes = '';
let subPackageStr = '';
let basename = 'pages';
const subPackage = [];
const template = `
// GENERATED CODE - DO NOT MODIFY MANUALLY
// **************************************************************************
// Auto generated by c
// **************************************************************************

export const Routes = {
    {0}
}
export const RoutesConfig = [
    {1}
]
/** SubPackage 可删除  */
const subPackages = [
  {2}
]
`;

function dealPackage(filePath: string, exec?): void {
  if (exec) {
    const packageName = exec[0].substring(6);
    const arr = subPackage.filter((r) => r.name === packageName);
    let item;
    if (arr.length) {
      if (arr.length > 1) {
        throw Error('package重复');
      } else {
        [item] = arr;
      }
    } else {
      item = {
        root: `${exec[0]}/`,
        name: packageName,
        pages: [],
      };
      subPackage.push(item);
    }
    const pagePath = filePath.substring(exec.index + exec[0].length + 1, filePath.lastIndexOf('.tsx'));
    item.pages.push(pagePath);
  }
}

/**
 *
 * @param fileName 文件名
 * @param dirpath 文件所属的文件夹地址
 */

function readFile(fileName: string, dirpath: string) {
  const filePath = path.join(dirpath, fileName);
  const fileStats = fs.statSync(filePath);

  if (fileStats.isFile()) {
    if (fileName.includes('Page.tsx')) {
      const routeName = fileName.substring(0, fileName.lastIndexOf('.'));
      let url = filePath.substring(filePath.indexOf(basename));
      url = url.substring(0, url.lastIndexOf('.tsx'));
      routes += `${camelName(routeName)}: '/${url}',\n\t`;
      dealPackage(filePath);
      const exec = reg.exec(filePath);
      if (exec) {
        dealPackage(filePath, exec);
      } else {
        routesConfig += `'${url}', \n\t`;
      }
    }
  } else {
    // eslint-disable-next-line no-use-before-define
    readDir(filePath);
  }
}

function readDir(filePath) {
  const fileNames = fs.readdirSync(filePath, { encoding: 'utf-8' });
  fileNames.forEach((fileName) => {
    readFile(fileName, filePath);
  });
}

export function wxRoute(src: string): void {
  console.log('wx route start');
  const filePath = path.join(process.cwd(), src);
  console.log(basename, 'base')
  readDir(filePath);
  subPackage.forEach((pkg) => {
    subPackageStr += `{
    root: '${pkg.root}',
    name: '${pkg.name}',
    pages: [
      '${pkg.pages.join('\',\n\t\'')}'
    ]
  },`;
  });

  let str = template.replace('{0}', routes);
  str = str.replace('{1}', routesConfig);
  str = str.replace('{2}', subPackageStr);
  console.log(str, 'str');
  fs.writeFileSync(
    path.resolve(filePath, '..', 'constants/routes.ts'),
    str.replace(/\\/g, '/'),
  );
}
