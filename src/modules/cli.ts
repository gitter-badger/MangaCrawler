/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Manga
 * Description: CLI界面模块
 * License: GPL-3.0
 */

import * as inquirer from 'inquirer';
import { homedir } from "os";

import {
    Results,
    CallbackFn,
    Logger,
} from "./misc";

// inquirer validate验证函数的返回值
type ValidationSets = string | boolean;

// 家目录
const home: string = homedir();

// 输入结果
const cliResults: Results = {
    url: '',
    path: '',
    limit: 0,
}

function cli(mgSite: string,callback: CallbackFn): void {
    switch (mgSite) {
        case "dm5":
            dm5();
            break;
        case "mhxin":
            mhxin();
            break;
    }

    function dm5(): void {
        inquirer.prompt([
            {
                type:'input',
                name: 'url',
                message: "Please enter the manga's URL :",
                validate(val: string): ValidationSets {
                    let blocks: string[] = val.split("/");
                    // 判断url包含的斜杠，仅需3个
                    if (blocks.length !== 4) {
                        return Logger.err('Invalid URL format. [I-0x0101]',1) as string;
                    }
                    // 判断协议是否合法
                    else if (blocks[0].match("http:") || blocks[0].match("https:")) {
                        // 判断第二个块是否无值
                        if (!(blocks[1] === '')) {
                            return Logger.err('Invalid URL usage. [I-0x0103]',1) as string;
                        }
                        // 判断网站是否正确 && 是否以'm'开头 && 是否包含分页符号“-”
                        else if (blocks[2] === "www.dm5.com" && blocks[3].slice(0,1) === "m" && !(blocks[3].match("-"))){
                            return true;
                        }
                        else {
                            return Logger.err('Invalid domain or Manga ID. [I-0x0104]',1) as string;
                        }
                    }
                    else {
                        return Logger.err('Unsupported transport protocol. [I-0x0102]',1) as string;
                    }
                },
            },
        ]).then(({ url }) => {
            cliResults.url = url;
            defaultPrompts();
        }).catch((err): void => callback(err));
    }

    function mhxin(): void {
        inquirer.prompt([
            {
                type: 'input',
                name: 'url',
                message: "Please enter the manga's URL :",
                validate(val:string): ValidationSets {
                    let blocks: string[] = val.split("/");
                    // 判断url包含的斜杠，仅需5个
                    if (blocks.length !== 6) {
                        return Logger.err('Invalid URL format. [I-0x0201]',1) as string;
                    }
                    // 判断协议是否合法
                    else if (blocks[0].match("http:") || blocks[0].match("https:")) {
                        // 判断第二个块是否有值 || 第五个块是否无值
                        if (!(blocks[1] === '') || blocks[4] === '') {
                            return Logger.err('Invalid URL usage. [I-0x0203]',1) as string;
                        }
                        // 判断网站是否正确 && 目录是否指向“manhua” && 后缀是否为“.html”
                        else if (blocks[2] === "m.mhxin.com" && blocks[3] === "manhua" && blocks[5].slice(-5) === ".html") {
                            return true;
                        }
                        else {
                            return Logger.err('Invalid domain or resource directory or Manga ID. [I-0x0204]',1) as string;
                        }
                    }
                    else {
                        return Logger.err('Unsupported transport protocol. [I-0x0202]') as string;
                    }
                },
            },
        ]).then(({ url }) => {
            cliResults.url = url;
            defaultPrompts();
        }).catch((err): void => callback(err));
    }

    function defaultPrompts(): void {
        inquirer.prompt([
            // 保存路径
            {
                type:'input',
                name: 'path',
                message: "Please enter the path to save it :",
                validate(val: string): ValidationSets {
                    // 判断末尾是否含斜杠
                    if (val.slice(-1) === "/" && val.length > 1) {
                        return Logger.err('You don\'t need to add "/" at the end of the path. [I-0x0001]',1) as string;
                    }
                    else {
                        return true;
                    }
                },
                filter(val: string): string {
                    if (val.slice(0,1) === "~") {
                        val = home + val.slice(1);
                        return val;
                    }
                    else {
                        return val;
                    }
                },
            },
            // 下载请求限制
            {
                type:'input',
                name: 'request',
                message: "Download requests limit (1-16) :",
                validate(val: number): ValidationSets {
                    // 判断输入数字是否合法
                    if (val >=1 && val <= 16) {
                        return true;
                    }
                    else {
                        return Logger.err('Invalid number. [I-0x0002]') as string;
                    }
                },
                filter(val: number): number {
                    // 防止因parseInt处理的数据导致无法重新输入，仅在true时返回
                    if (val >= 1 && val <= 16) {
                        return ~~val;
                    }
                    else {
                        return val;
                    }
                },
            },
        ]).then(({ path, request }) => {
            cliResults.path = path;
            cliResults.limit = request;
            callback(null,cliResults);
        }).catch((err): void => callback(err));
    }
}

export { cli, CallbackFn };
