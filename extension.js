// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

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


// WebviewViewProvider for the custom sidebar view
const path = require('path');
const fs = require('fs');

class CodeFolderSummaryViewProvider {
	constructor(context) {
		this.context = context;
	}

	resolveWebviewView(webviewView) {
		this.webviewView = webviewView;
		webviewView.webview.options = {
			enableScripts: true
		};
		this._render();

		webviewView.webview.onDidReceiveMessage(async (msg) => {
			if (msg.command === 'openFolderSelector') {
				// Show folder selector UI in the sidebar
				this._renderFolderSelector();
			} else if (msg.command === 'applyIgnoredFolders') {
				await this.context.globalState.update('ignoredFolders', msg.selected);
				this._render();
			} else if (msg.command === 'removeIgnoredFolder') {
				const ignored = this.context.globalState.get('ignoredFolders', []);
				const updated = ignored.filter(f => f !== msg.folder);
				await this.context.globalState.update('ignoredFolders', updated);
				this._render();
			}
		});
	}

	_render() {
		const dirPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath;
		if (!dirPath) {
			this.webviewView.webview.html = '<div style="padding:1em;">No workspace folder open</div>';
			return;
		}
		const ignored = this.context.globalState.get('ignoredFolders', []);
		// Recursively walk the directory and count file extensions, skipping ignored folders
		function walk(dir, extCount) {
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
					if (ignored.includes(relPath)) continue;
					walk(fullPath, extCount);
				} else if (entry.isFile()) {
					const ext = path.extname(entry.name) || '[no extension]';
					extCount[ext] = (extCount[ext] || 0) + 1;
				}
			}
		}
		const extCount = {};
		walk(dirPath, extCount);
		const total = Object.values(extCount).reduce((a, b) => a + b, 0);
		// Map of file extension to Material Design Icons (mdi) class
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
			// Try to match by extension, fallback to generic file icon
			return extIcons[ext] || 'mdi-file-outline';
		}
		const items = Object.entries(extCount)
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map(([ext, count]) => {
				const percent = total ? ((count / total) * 100).toFixed(1) : '0.0';
				const mdiIcon = getMdiIcon(ext);
				return `<div style="display:flex;align-items:center;margin-bottom:2px;">
					<span class="mdi ${mdiIcon}" style="margin-right:8px;font-size:18px;vertical-align:middle;"></span>
					<span style="width:70px;">${ext}</span>
					<span style="font-weight:bold;">${count}</span>
					<span style="color:var(--vscode-descriptionForeground);margin-left:6px;">${percent}%</span>
				</div>`;
			})
			.join('');
	   const chips = ignored.map(f => `
		   <span style="
			   background: var(--vscode-editorWidget-background);
			   color: var(--vscode-editorWidget-foreground);
			   border: 1px solid var(--vscode-editorWidget-border);
			   border-radius: 12px;
			   padding: 2px 10px;
			   margin-right: 6px;
			   display: inline-flex;
			   align-items: center;">
			   ${f}
			   <button data-folder="${f}" style="
				   border: none;
				   background: none;
				   color: var(--vscode-editorWidget-foreground);
				   cursor: pointer;
				   font-weight: bold;
				   margin-left: 4px;">&times;</button>
		   </span>`).join('');
	   this.webviewView.webview.html = `
		   <div style="padding:1em 1em 0 1em; color: var(--vscode-editorWidget-foreground);">
			   <div style="margin-bottom:10px;display:flex;align-items:center;flex-wrap:wrap;">
				   <span style="font-size:13px;margin-right:8px;">Ignored:</span>
				   ${chips || '<span style=\"color:var(--vscode-descriptionForeground);\">None</span>'}
				   <button id="addIgnore" style="
					   margin-left:8px;
					   padding:2px 8px;
					   border-radius:10px;
					   border:1px solid var(--vscode-button-border, var(--vscode-editorWidget-border));
					   background: var(--vscode-button-background, var(--vscode-editorWidget-background));
					   color: var(--vscode-button-foreground, var(--vscode-editorWidget-foreground));
					   cursor:pointer;">+</button>
			   </div>
			   <div style="margin-top:10px;">
				   <div style="font-weight:bold;margin-bottom:6px;">File Type Summary</div>
				   ${items || '<span style=\"color:var(--vscode-descriptionForeground);\">No files found</span>'}
			   </div>
		   </div>
		   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
		   <script>
			   (function() {
				   const vscode = acquireVsCodeApi();
				   document.getElementById('addIgnore').onclick = () => {
					   vscode.postMessage({command:'openFolderSelector'});
				   };
				   document.querySelectorAll('button[data-folder]').forEach(btn => {
					   btn.onclick = () => {
						   vscode.postMessage({command:'removeIgnoredFolder', folder: btn.getAttribute('data-folder')});
					   };
				   });
			   })();
		   </script>
	   `;
	}

	_renderFolderSelector() {
		const dirPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath;
		let entries;
		try {
			entries = fs.readdirSync(dirPath, { withFileTypes: true });
		} catch (e) {
			this.webviewView.webview.html = '<div style="padding:1em;">Unable to read workspace directory</div>';
			return;
		}
		const folders = entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);
		const ignored = this.context.globalState.get('ignoredFolders', []);
		this.webviewView.webview.html = `
			<div style="padding:1em;">
				<div style="font-weight:bold;margin-bottom:8px;">Select folders to ignore</div>
			   <form id="ignoreForm">
				   ${folders.map(f => `<label style='display:block;margin-bottom:4px;'><input type='checkbox' name='folder' value='${f}' ${ignored.includes(f) ? 'checked' : ''}/> ${f}</label>`).join('')}
				   <div style="margin-top:12px;display:flex;gap:8px;">
					   <button type="submit" style="
						   background: var(--vscode-button-background);
						   color: var(--vscode-button-foreground);
						   border: none;
						   border-radius: 4px;
						   padding: 4px 16px;
						   font-size: 13px;
						   cursor: pointer;
					   ">Apply</button>
					   <button type="button" id="cancelBtn" style="
						   background: var(--vscode-button-secondaryBackground, var(--vscode-button-background));
						   color: var(--vscode-button-secondaryForeground, var(--vscode-button-foreground));
						   border: none;
						   border-radius: 4px;
						   padding: 4px 16px;
						   font-size: 13px;
						   cursor: pointer;
					   ">Cancel</button>
				   </div>
			   </form>
			</div>
			<script>
				(function() {
					const vscode = acquireVsCodeApi();
					document.getElementById('ignoreForm').onsubmit = function(e) {
						e.preventDefault();
						const selected = Array.from(document.querySelectorAll('input[name=folder]:checked')).map(cb => cb.value);
						vscode.postMessage({command:'applyIgnoredFolders', selected});
					};
					document.getElementById('cancelBtn').onclick = function() {
						vscode.postMessage({command:'applyIgnoredFolders', selected: ${JSON.stringify(ignored)}});
					};
				})();
			</script>
		`;
	}
}

const provider = new CodeFolderSummaryViewProvider(context);
context.subscriptions.push(
	vscode.window.registerWebviewViewProvider('codeFolderSummaryView', provider)
);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
