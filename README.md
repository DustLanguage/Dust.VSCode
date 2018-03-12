# Visual Studio Extension for programming language Dust


## Introduction

This repo contains a VS code extension that runs a language server for Dust.
Dust is an open source programming language written in C# with .NET Core.

The extension observes all 'plaintext' documents (documents from all editors not associated with a language)
and uses the server to provide validation and completion proposals.

The code for the extension is in the 'client' folder. It uses the 'vscode-languageclient' node module to launch the language server.
The language server is located in the 'server' folder. 

The file 'dust.json' reperesents the TextMesh Grammar configuration for Dust programming language in JSON that is readable by VS Code.


