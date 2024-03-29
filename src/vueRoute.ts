import path from 'path';
import fs from 'fs';
import { camelize } from './utils';

const reg = /pages[a-z | A-z]*Package/;
let pages = '';
let routes = '';
let routesConfig = '';
let subPackageStr = '';
const tempRoutesConfig: any[] = [];
const basename = 'pages';
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

function dealPackage(filePath: string, exec?: RegExpExecArray): void {
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
    const pagePath = filePath.substring(
      exec.index + exec[0].length + 1,
      filePath.lastIndexOf('.vue'),
    );
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
    if (fileName.includes('Page.vue')) {
      const routeName = fileName.substring(0, fileName.lastIndexOf('.'));
      let url = filePath.substring(filePath.indexOf(basename));
      url = url.substring(0, url.lastIndexOf('.vue'));
      routes += `${camelize(routeName)}: '/${url}',\n\t`;
      routesConfig += `'/${url}', \n\t`;
      tempRoutesConfig.push(url);
      dealPackage(filePath);
      const exec = reg.exec(filePath);
      if (exec) {
        dealPackage(filePath, exec);
      } else {
        pages += `"${url}", \n\t`;
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

export function updateConfig() {
  const filePath = path.join(process.cwd(), 'src/pages.json');
  const fbuffer = fs.readFileSync(filePath);
  const fStr = fbuffer.toString('utf8');
  let str = fStr;
  const matchSubPackage = str.match(/(subPackages[\s]*:[\s]*\[)/);
  if (matchSubPackage) {
    const subPackageValue = str.substring(
      matchSubPackage.index + matchSubPackage[0].length,
      str.indexOf('window', matchSubPackage.index),
    );
    str = str.replace(subPackageValue, `${subPackageStr}],`);
  }
  const matchPages = str.match(/("pages"[\s]*:[\s]*\[)/);
  if (matchPages) {
    const pagesValue = str.substring(
      matchPages.index + matchPages[0].length,
      str.indexOf(']', matchPages.index),
    );
    const pagesArr: Array<any> = JSON.parse(`[${pagesValue.replace(/\/\//g, '/')}]`); // 原有route
    const tempArr = [];
    tempRoutesConfig.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      return -1;
    });
    tempRoutesConfig.forEach((r) => {
      const url = r.trim().replace(/\\/g, '/');
      if (url) {
        const index = pagesArr.findIndex((page) => page.path === url);
        if (index > -1) {
          tempArr.push(pagesArr[index]);
        } else {
          tempArr.push({
            path: r,
          });
        }
      }
    });
    const tempStr = JSON.stringify(tempArr);
    str = str.replace(pagesValue, tempStr.substring(1, tempStr.length - 1).replace(/\\\\/g, '/'));
  }

  fs.writeFileSync(filePath, JSON.stringify(JSON.parse(str.replace(/\\/g, '/')), null, 2));
}

export function vueRoute(src: string): void {
  console.log('wx route start');
  const filePath = path.join(process.cwd(), src);
  readDir(filePath);
  subPackage.forEach((pkg) => {
    subPackageStr += `{
    root: '${pkg.root}',
    name: '${pkg.name}',
    pages: [
      '${pkg.pages.join("',\n\t'")}'
    ]
  },`;
  });

  let str = template.replace('{0}', routes);
  str = str.replace('{1}', routesConfig);
  str = str.replace('{2}', subPackageStr);
  fs.writeFileSync(
    path.resolve(filePath, '..', 'router/routes.ts'),
    str.replace(/\\/g, '/'),
  );
  updateConfig();
  console.log('wx route end');
}
