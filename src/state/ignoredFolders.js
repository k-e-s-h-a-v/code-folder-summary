function getIgnoredFolders(context) {
    return context.globalState.get('ignoredFolders', []);
}

async function setIgnoredFolders(context, folders) {
    await context.globalState.update('ignoredFolders', folders);
}

module.exports = { getIgnoredFolders, setIgnoredFolders };
