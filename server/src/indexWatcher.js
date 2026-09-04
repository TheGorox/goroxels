// helper script to watch for index.html updates

const fs = require('fs');
const path = require('path');

module.exports = function watchIndex({ logger, filePath, callback }) {
    const fsPromises = fs.promises;

    let lastContent = null;
    let lastMtime = null;

    if (fs.existsSync(filePath)) {
        lastContent = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        lastMtime = stats.mtimeMs;
        callback(lastContent);
    }

    async function checkFile() {
        try {
            const stats = await fsPromises.stat(filePath);
            const currentMtime = stats.mtimeMs;

            if (lastMtime === null || currentMtime > lastMtime) {
                const newContent = await fsPromises.readFile(filePath, 'utf8');

                if (newContent.length > 100 && (lastContent === null || newContent !== lastContent)) {
                    lastContent = newContent;
                    callback(newContent);
                    logger.info('index.html updated and reloaded');
                }

                lastMtime = currentMtime;
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                logger.error('Failed to check index.html', err);
            }
        }
    }

    const interval = setInterval(checkFile, 1000);

    return {
        close: () => clearInterval(interval)
    };
};