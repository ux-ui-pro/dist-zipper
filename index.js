#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

(async () => {
  try {
    const rootDir = path.basename(process.cwd());
    const outputFilePath = path.join('dist', `${rootDir}.zip`);
    const output = fs.createWriteStream(outputFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log(`Архивирование завершено. Файл ${outputFilePath} создан`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    const distPath = path.resolve('dist');

    archive.glob('**/*', {
      cwd: distPath,
      ignore: [`${rootDir}.zip`],
    });

    await archive.finalize();
  } catch (err) {
    console.error(`Ошибка при архивировании: ${err.message}`);
  }
})();
