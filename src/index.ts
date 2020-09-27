#!node
/**
 * create by c
 * 使用规则，分包的文件名必须末尾Package，页面名称末尾Page
 */
import commander from 'commander';
import { wxRoute } from './taro_route';
import { flutterImage } from './flutter_image';
import { reactImage } from './react_image';
import { generateFile } from './taro_file';

commander
  .command('wxRoute')
  .option('-p, --path <path>', '查找路径,default to src\\pages', 'src\\pages')
  .description('自动生成微信小程序pages路由')
  .action((cmd) => {
    // wxRoute()
    console.log('使用规则，分包的文件名必须末尾Package，页面名称末尾Page');
    console.log(process.cwd(), ' 当前执行程序的路径');
    wxRoute(cmd.path);
  });

commander
  .command('image')
  .option('-p, --path <>', '查找路径,default to assets')
  .option('-t, --target <>', 'fluter or taro', '')
  .description('生成fluter or taro Image类')
  .action((cmd) => {
    const { target } = cmd;
    if (!cmd.target) {
      throw new Error('target option is required');
    }
    if (target === 'flutter') {
      flutterImage(cmd.path ?? 'asstes');
    } else {
      reactImage(cmd.path ?? 'src\\assets');
    }
  });

commander
  .command('taro')
  .option('-n, --filename <>', '文件名', '.\\')
  .option('-c --config <>', '是否生成config文件,默认为true', true)
  .description('自动生成taro3页面文件')
  .action((cmd) => {
    const { filename, config } = cmd;

    generateFile((filename as string).substring(1), config);
  });
commander.parse(process.argv);
