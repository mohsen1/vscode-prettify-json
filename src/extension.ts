import * as vscode from 'vscode';

const LINE_SEPERATOR = /\n|\r\n/;

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.prettifyJSON', () => {

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const raw = editor.document.getText();
		let json = null;

		try {
			json = JSON.parse(raw);
		} catch (jsonParseError) {
			return; // TODO: Handle invalid JSON
		}

		let pretty = JSON.stringify(json, null, 4);

		editor.edit(builder=> {
			const start = new vscode.Position(0, 0);
			const lines = raw.split(LINE_SEPERATOR);
			const end = new vscode.Position(lines.length, lines[lines.length - 1].length);
			const allRange = new vscode.Range(start, end);
			builder.replace(allRange, pretty);
		}).then(success=> {

			// TODO: unselect the text

		});

	});

	context.subscriptions.push(disposable);
}