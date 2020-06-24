#!node
/**
 * create by c
 * 使用规则，分包的文件名必须末尾Package，页面名称末尾Page
 */
import commander from 'commander';
import { wxRoute } from './taro_route';
import { flutterImage } from './flutter_image';
import { reactImage } from './react_image';

commander
  .command('wx')
  .option('-p, --path <path>', '查找路径,default to src\\pages', 'src\\pages')
  .description('start command description')
  .action((cmd) => {
    // wxRoute()
    console.log('使用规则，分包的文件名必须末尾Package，页面名称末尾Page');
    console.log(process.cwd(), ' 当前执行程序的路径');
    wxRoute(cmd.path);
  });

commander
  .command('f')
  .option('-p, --path <>', '查找路径,default to assets', 'assets')
  .description('start command description')
  .action((cmd) => {
    console.log(cmd.path, 'ooooooooooooooo');
    flutterImage(cmd.path);
  });

commander
  .command('react')
  .option('-p, --path <>', '查找路径,default to src\\assets', 'src\\assets')
  .description('start command description')
  .action((cmd) => {
    reactImage(cmd.path);
  });
commander.parse(process.argv);
