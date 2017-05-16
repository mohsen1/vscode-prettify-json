import {
  ExtensionContext,
  Position,
  Range,
  TextEditorDecorationType,
  window,
  commands,
  workspace
} from 'vscode';

import * as vscode from 'vscode';

const stripComments = require('strip-json-comments');
const jsonlint = require('jsonlint');

const LINE_SEPERATOR = /\n|\r\n/;

// TODO: make this configurable.
const JSON_SPACE = 4;

export function activate(context: ExtensionContext) {

  let disposable = commands.registerCommand('extension.prettifyJSON', () => {

    const editor = window.activeTextEditor;

    if (!editor) {
      return;
    }

    const editor_config = workspace.getConfiguration('editor');
    const tab_size = editor_config.get('tabSize', JSON_SPACE);

    const raw = editor.document.getText();
    let json = null;

    try {
      json = jsonlint.parse(stripComments(raw));
    } catch (jsonLintError) {
      const message: string = jsonLintError.message;
      const lineNumber = parseInt(message.substring(message.indexOf('line ') + 5, message.indexOf(':')), 10);


      return;
    }

    let pretty = JSON.stringify(json, null, tab_size);

    editor.edit(builder=> {
      const start = new Position(0, 0);
      const lines = raw.split(LINE_SEPERATOR);
      const end = new Position(lines.length, lines[lines.length - 1].length);
      const allRange = new Range(start, end);
      builder.replace(allRange, pretty);
    }).then(success=> {

      // TODO: unselect the text

    });

  });

  context.subscriptions.push(disposable);
}