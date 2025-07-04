const extIcons = {
    '.js': 'mdi-language-javascript',
    '.ts': 'mdi-language-typescript',
    '.json': 'mdi-code-json',
    '.md': 'mdi-language-markdown',
    '.py': 'mdi-language-python',
    '.java': 'mdi-language-java',
    '.c': 'mdi-language-c',
    '.cpp': 'mdi-language-cpp',
    '.h': 'mdi-alpha-h-box-outline',
    '.hpp': 'mdi-alpha-h-box-outline',
    '.css': 'mdi-language-css3',
    '.scss': 'mdi-language-css3',
    '.html': 'mdi-language-html5',
    '.xml': 'mdi-xml',
    '.sh': 'mdi-console',
    '.yml': 'mdi-file-document-outline',
    '.yaml': 'mdi-file-document-outline',
    '.txt': 'mdi-file-document-outline',
    '.svg': 'mdi-svg',
    '.png': 'mdi-file-image-outline',
    '.jpg': 'mdi-file-image-outline',
    '.jpeg': 'mdi-file-image-outline',
    '.gif': 'mdi-file-image-outline',
    '.lock': 'mdi-lock-outline',
    '[no extension]': 'mdi-file-outline',
};

function getMdiIcon(ext) {
    return extIcons[ext] || 'mdi-file-outline';
}

module.exports = { getMdiIcon };
