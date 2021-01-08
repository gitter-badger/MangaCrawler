"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Manga
 * Description: 杂项模块
 * License: GPL-3.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = exports.downloadImg = exports.OutTimer = exports.Logger = void 0;
const chalk = require("chalk");
const axios_1 = require("axios");
// 本地模块
const cli_1 = require("./cli");
const dirCheck_1 = require("./dirCheck");
const fs = require("fs");
// 日志打印 -- 模块
const Logger = {
    err: (msg, returnStr) => returnStr ? `${chalk.bgRed(' Error ')} ${msg}` : console.log(`${chalk.bgRed(' Error ')} ${msg}`),
    warn: (msg, returnStr) => returnStr ? `${chalk.bgRed(' Warn ')} ${msg}` : console.log(`${chalk.bgRed(' Warn ')} ${msg}`),
    info: (msg, returnStr) => returnStr ? `${chalk.bgBlue(' Info ')} ${msg}` : console.log(`${chalk.bgBlue(' Info ')} ${msg}`),
    succ: (msg, returnStr) => returnStr ? `${chalk.bgGreen(' Success ')} ${msg}` : console.log(`${chalk.bgGreen(' Success ')} ${msg}`),
    prog: (msg, returnStr) => returnStr ? `${chalk.bgYellow(' Progress ')} ${msg}` : console.log(`${chalk.bgYellow(' Progress ')} ${msg}`),
    newLine: (line) => {
        for (let i = 0; i < line; i++) {
            console.log('\n');
        }
    }
};
exports.Logger = Logger;
// 超时计时器 -- 漫画
class OutTimer {
    constructor(timeout, errorCode) {
        // 超时，结束进程
        this.timerID = setTimeout(() => {
            Logger.err(`\n\nTimed out for ${timeout} seconds. [M-${errorCode}]`);
            process.exit(1);
        }, timeout * 1000);
    }
    // 成功，清除计时器
    clear() {
        clearTimeout(this.timerID);
    }
}
exports.OutTimer = OutTimer;
// 下载文件 -- 模块
function downloadImg(url, path, config = {}, callback) {
    config.responseType = 'stream';
    const writer = fs.createWriteStream(path);
    axios_1.default.get(url, config).then(({ data }) => data.pipe(writer)).catch((err) => callback(err));
    writer.on("finish", () => callback(null));
    writer.on("error", () => callback('error'));
}
exports.downloadImg = downloadImg;
// CLI界面和目录检查 -- 漫画
function prepare(site, callback) {
    cli_1.cli(site, (err, result) => {
        if (err) {
            callback(err + '[I-0x0003]');
        }
        else {
            dirCheck_1.checkPath(result.path, (err_1) => {
                if (err_1) {
                    callback(err_1);
                }
                else {
                    callback(null, result);
                }
            });
        }
    });
}
exports.prepare = prepare;
