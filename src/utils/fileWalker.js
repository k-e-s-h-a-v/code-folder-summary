const fs = require('fs');
const path = require('path');

function walkDirectory(dir, ignored, extCount, dirPath) {
    const relDir = path.relative(dirPath, dir);
    if (relDir && ignored.includes(relDir)) {
        return;
    }
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return;
    }
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(dirPath, fullPath);
        if (entry.isDirectory()) {
            walkDirectory(fullPath, ignored, extCount, dirPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name) || '[no extension]';
            extCount[ext] = (extCount[ext] || 0) + 1;
        }
    }
}

module.exports = { walkDirectory };
