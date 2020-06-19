"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelName = void 0;
/// 小驼峰
function camelName(name) {
    if (name.indexOf('_') > -1) {
        const strArr = name.split('_');
        strArr.forEach((str, index) => {
            if (index === 0) {
                strArr[index] = str.toLowerCase();
            }
            else {
                strArr[index] = str.substring(0, 1).toUpperCase() + str.substring(1);
            }
        });
        return strArr.join('');
    }
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
exports.camelName = camelName;
exports.default = camelName;
