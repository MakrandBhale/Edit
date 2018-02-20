
// Library used: RequireJS
// First version of iEdit loaded all the dependancies once, at the startup
// This was very bad idea so this version changes thigs by adding RequireJS which allows 
// Codemirror modules to be loaded dynamically when needed, effectively reducing statup time.
//let requirejs = require('requirejs');
let cMirror;
requirejs([
    "../cm/lib/codemirror", "../cm/mode/javascript/javascript",
    "../cm/addon/dialog/dialog"

], function (CodeMirror) {
    cMirror = CodeMirror;
    editor = CodeMirror(document.getElementById("code"), {
        mode: "javascript",
        theme: "hopscotch"
    });

});

// following will execute commands given from renderer process

const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;
const fs = require('fs');
const path = require('path');

// file utils

function getFileName(pathName) {
    return path.parse(pathName).base;
}

ipcRenderer.on('undo', () => {
    editor.execCommand('undo');
});

ipcRenderer.on('redo', () => {
    editor.execCommand('redo');
});

ipcRenderer.on('selectall', () => {
    editor.execCommand('selectAll');
});

ipcRenderer.on('find', () => {
    requirejs([
        "../cm/addon/search/search", "../cm/addon/search/searchcursor",
        "../cm/addon/search/jump-to-line"
    ], () => {
        cMirror.commands.find(editor);
    })

});

ipcRenderer.on('findNext', () => {
    editor.execCommand('findNext');
});

ipcRenderer.on('findPrev', () => {
    editor.execCommand('findPrev');
});

ipcRenderer.on('replace', () => {
    editor.execCommand('replace');
});

ipcRenderer.on('replaceAll', () => {
    editor.execCommand('replaceAll');
});

ipcRenderer.on('showSaveDialog', () => {
    dialog.showSaveDialog({
        filters: [
            { name: 'All Files', extensions: ['*'] },
            { name: 'HTML Files', extensions: ['html'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'JavaScript Files', extensions: ['js'] },
            { name: 'Python Files', extensions: ['py'] },
            { name: 'C Files', extensions: ['c'] },
            { name: 'C++ Files', extensions: ['cpp'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Java Files', extensions: ['java', 'class'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'C# Files', extensions: ['cs'] }
        ]
    }, function (fileName) {
        fs.writeFile(fileName, editor.doc.getValue(), (err) =>{
            if(err) ipcRenderer.send("error", err);
            else ipcRenderer.sendToHost("fileName", getFileName(fileName));
        });
    });
});

ipcRenderer.on('showOpenDialog', () => {
    dialog.showOpenDialog({
        filters: [
            { name: 'All Files', extensions: ['*'] },
            { name: 'HTML Files', extensions: ['html'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'JavaScript Files', extensions: ['js'] },
            { name: 'Python Files', extensions: ['py'] },
            { name: 'C Files', extensions: ['c'] },
            { name: 'C++ Files', extensions: ['cpp'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Java Files', extensions: ['java', 'class'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'C# Files', extensions: ['cs'] }
        ]
    }, (fileNames) => {
        console.log(fileNames)
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                ipcRenderer.sendToHost("error", err);
            }
            else {
                editor.doc.setValue(data);
                ipcRenderer.sendToHost("fileName", getFileName(fileName));
            }
        });
    });
});



//TODO : use FILE_WATCHER ;; add status bar. file type based dynamic highlighting and mode changing.