#!node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * create by c
 * 使用规则，分包的文件名必须末尾Package，页面名称末尾Page
 */
const commander_1 = __importDefault(require("commander"));
const taro_route_1 = require("./taro_route");
commander_1.default
    .command('wx')
    .option('-p, --path <path>', '查找路径,default to src\\pages', 'src\\pages')
    .description('start command description')
    .action((cmd) => {
    // wxRoute()
    console.log('使用规则，分包的文件名必须末尾Package，页面名称末尾Page');
    console.log(process.cwd(), ' 当前执行程序的路径');
    taro_route_1.wxRoute(cmd.path);
});
commander_1.default
    .command('f')
    .option('-p, --path')
    .description('start command description')
    .action(() => {
    console.log('start');
});
commander_1.default.parse(process.argv);
