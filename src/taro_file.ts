import fs from 'fs';

const configTs = `
export default {
    navigationBarTitleText: '标题',
}
`;

const widgetTx = `
import React, { FC } from 'react';
import { View } from '@tarojs/components';

import './{0}.scss';

const {0}: FC = ({}) => {
    return <View >{0}</View>;
}

export default {0};
`;

export function generateFile(fileName: string, isConfig: boolean) {
    const first = fileName[0];
    fileName = fileName.replace(first, first.toUpperCase())
    const str = widgetTx.replace(/\{0\}/g, fileName);
    if (!fs.existsSync(`${process.cwd()}/${fileName}`)) {
        fs.mkdirSync(`${process.cwd()}/${fileName}`)
    };
    fs.writeFileSync(`${process.cwd()}/${fileName}/${fileName}.tsx`, str);
    fs.writeFileSync(`${process.cwd()}/${fileName}/${fileName}.scss`, '');
    if (isConfig) {
        fs.writeFileSync(`${process.cwd()}/${fileName}/${fileName}.config.ts`, configTs);
    }
}