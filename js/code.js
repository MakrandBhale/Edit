
// Library used: RequireJS
// First version of iEdit loaded all the dependancies once, at the startup
// This was very bad idea so this version changes thigs by adding RequireJS which allows 
// Codemirror modules to be loaded dynamically when needed, effectively reducing statup time.
//let requirejs = require('requirejs');
let cMirror, file = null;
requirejs([
    "../cm/lib/codemirror", "../cm/mode/javascript/javascript",
    "../cm/mode/htmlmixed/htmlmixed",  "../cm/mode/css/css", "../cm/mode/meta",
    "../cm/addon/dialog/dialog", "../cm/addon/selection/active-line",
    "../cm/addon/scroll/simplescrollbars","../cm/addon/edit/matchtags",
    "../cm/addon/edit/matchbrackets",
    

], function (CodeMirror) {
    cMirror = CodeMirror;
    editor = CodeMirror(document.getElementById("code"), {
        theme: "dracula",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: "htmlmixed",
    });
    setFileWatcher();
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
 
function setFileWatcher(){
    editor.on("change", (cm, change) =>{
        if(file != null){
            fs.writeFile(file,editor.doc.getValue(), (err) => {
                if(err){ipcRenderer.sendToHost("error" ,err)}
           });
        }
    })
}
// change syntax highlight

function changeMode(pathName){
    // codemirror automatically returns the vitals of the file and decides the mode that should be used.
    // How Cool ... innit ?
    console.log(cMirror.findModeByFileName(pathName));
    editor.setOption("mode", cMirror.findModeByFileName(pathName).mime);
    ipcRenderer.send("fileMode",cMirror.findModeByFileName(pathName).name);
}

ipcRenderer.on('autoclose', ()=>{
    requirejs([
        "../cm/addon/edit/closetag", "../cm/addon/edit/closebrackets"
    ], () =>{
        editor.setOption('autoCloseTags', true);
        editor.setOption('autoCloseBrackets', true);
    });
});

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

ipcRenderer.on('save', ()=>{
    
    // if file isn't saved, show the save dialog. file == null means the file opened in current window is not saved.
    if(file == null){
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
            fs.writeFile(fileName, editor.doc.getValue(), (err) => {
                if (err) ipcRenderer.send("error", err);
                else {
                    file = fileName;
                    ipcRenderer.sendToHost("fileName", getFileName(fileName));
                    changeMode(fileName);
                    ipcRenderer.sendToHost("fileSaved");
                }
            });
        });
    }
    else{
        fs.writeFile(file,editor.doc.getValue(), (err) => {
            if(err){ipcRenderer.sendToHost("error" ,err)}
       });
    }
});

ipcRenderer.on('showSaveAsDialog', () => {
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
        fs.writeFile(fileName, editor.doc.getValue(), (err) => {
            if (err) ipcRenderer.send("error", err);
            else {
                file = fileName;
                ipcRenderer.sendToHost("fileName", getFileName(fileName));
                changeMode(fileName);
                ipcRenderer.sendToHost("fileSaved");
            }
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
        
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                ipcRenderer.sendToHost("error", err);
            }
            else {
                file = fileNames[0];
                editor.doc.setValue(data);
                ipcRenderer.sendToHost("fileName", getFileName(fileName));
                changeMode(fileName);
            }
        });
    });
});



//TODO : use FILE_WATCHER ;; add status bar. file type based dynamic highlighting and mode changing.
//TODO : add Save As.. option