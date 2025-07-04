const vscode = require('vscode');
const { CodeFolderSummaryViewProvider } = require('./src/providers/codeFolderSummaryViewProvider');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Output diagnostic information
	console.log('Congratulations, your extension "code-folder-summary" is now active!');

	// Register the Hello World command
	const disposable = vscode.commands.registerCommand('code-folder-summary.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from code-folder-summary!');
	});
	context.subscriptions.push(disposable);

	// Register the custom sidebar view provider
	const provider = new CodeFolderSummaryViewProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('codeFolderSummaryView', provider)
	);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
