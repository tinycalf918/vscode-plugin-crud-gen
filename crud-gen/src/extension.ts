// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
const fs = require('fs');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "crud-gen" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('crud-gen.openPanel', (uri: vscode.Uri) => {
		// The code you place here will be executed every time your command is executed

		const panel = vscode.window.createWebviewPanel(
			'crudEditor',
			'CRUD Editor',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		
		panel.webview.html = getWebviewContent(context);
		
		panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(uri.path + message.text);
                    return;
            }
        }, undefined, context.subscriptions);
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(context: vscode.ExtensionContext): string{
	const indexHtmlPath = "src/webview/index.html";
	const resourcePath = path.join(context.extensionPath, indexHtmlPath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m:boolean, $1:string, $2:string) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}

// this method is called when your extension is deactivated
export function deactivate() {}
