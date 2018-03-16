/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as fs from 'fs'
import * as vscode from 'vscode'
import * as path from 'path'

const denodeify = require("denodeify");
const readFile = denodeify(fs.readFile);

process.env.NODE_ENV = 'development'

export async function activate(context: vscode.ExtensionContext) {
	// let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
	// // The debug options for the server
	// let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
	
	// // If the extension is launched in debug mode then the debug server options are used
	// // Otherwise the run options are used
	// let serverOptions: ServerOptions = {
	// 	run : { module: serverModule, transport: TransportKind.ipc },
	// 	debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	// }
	
	// // Options to control the language client
	// let clientOptions: LanguageClientOptions = {
	// 	// Register the server for plain text documents
	// 	documentSelector: [{scheme: 'file', language: 'plaintext'}],
	// 	synchronize: {
	// 		// Synchronize the setting section 'languageServerExample' to the server
	// 		configurationSection: 'lspSample',
	// 		// Notify the server about file changes to '.clientrc files contain in the workspace
	// 		fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
	// 	}
	// }
	
	// // Create the language client and start the client.
	// let disposable = new LanguageClient('lspSample', 'Language Server Example', serverOptions, clientOptions).start();
	
	// // Push the disposable to the context's subscriptions so that the 
	// // client can be deactivated on extension deactivation
	// context.subscriptions.push(disposable);

	if(process.env.NODE_ENV === 'development') {			
		let filePath = path.join(__dirname, '../../src/example.ds');

		readFile(filePath, {encoding: 'utf-8'}).then(async (data: string, error: Error) => {
			if (error) {
				console.error(error);
				return;
			}

			const textDocument = await vscode.workspace.openTextDocument({
				language: 'dust',
				content: data
			});

			vscode.window.showTextDocument(textDocument)
		});
	}

	context.subscriptions.push(vscode.commands.registerCommand('extension.dust-debug.getFilePath', (config) => {
		return vscode.window.showInputBox({
			placeHolder: "Please enter the name of a markdown file in the workspace folder"
		});
	}));

	// register a configuration provider for 'mock' debug type
	const provider = new DustDebugProvider()
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('dust', provider));
	context.subscriptions.push(provider);
}

class DustDebugProvider implements vscode.DebugConfigurationProvider {
	resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {
		// if launch.json is missing or empty
		if (!config.type && !config.request && !config.name) {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === 'dust' ) {
				config.type = 'dust';
				config.name = 'Run file';
				config.request = 'launch';
				config.filePath = '${file}';
				config.stopOnEntry = true;
			}
		}

		if (!config.filePath) {
			return vscode.window.showInformationMessage("Cannot find a source file to run.").then(_ => {
				return undefined;	// abort launch
			});
		}

		return config;
	}

	dispose() {

	}
}
