const {remote} = require('electron')
const {Menu, MenuItem} = remote

const template = [
    {
        label: 'File',
        submenu:[
          {
            label: 'Open',
            accelerator: 'Ctrl+O',
            click: function openFile () {
                    clearTimeout(timer);
                   dialog.showOpenDialog({ filters: [
                     { name: 'All Files', extensions: ['*'] },
                     {name: 'HTML Files', extensions: ['html']},
                     { name: 'Text Files', extensions: ['txt'] },
                     {name: 'JavaScript Files', extensions: ['js']},
                     {name: 'Python Files', extensions: ['py']},
                     {name: 'C Files', extensions: ['c']},
                     {name: 'C++ Files', extensions: ['cpp']},
                     {name: 'Text Files', extensions: ['txt']},
                     {name: 'Java Files', extensions: ['java','class']},
                     {name: 'Text Files', extensions: ['txt']},
                     {name: 'C# Files', extensions: ['cs']}

                    ]}, function (fileNames) {
                      console.log(fileNames)
                    if (fileNames === undefined) return;
                    var fileName = fileNames[0];
                    fs.readFile(fileName, 'utf-8', function (err, data) {
                      editor.doc.setValue(data);
                    });
                   });
                  }
          },
          {
            label: 'Save File',
            accelerator: 'Ctrl+S',
            click: function saveFile () {
                  dialog.showSaveDialog({ filters: [
                    { name: 'All Files', extensions: ['*'] },
                    {name: 'HTML Files', extensions: ['html']},
                    { name: 'Text Files', extensions: ['txt'] },
                    {name: 'JavaScript Files', extensions: ['js']},
                    {name: 'Python Files', extensions: ['py']},
                    {name: 'C Files', extensions: ['c']},
                    {name: 'C++ Files', extensions: ['cpp']},
                    {name: 'Text Files', extensions: ['txt']},
                    {name: 'Java Files', extensions: ['java','class']},
                    {name: 'Text Files', extensions: ['txt']},
                    {name: 'C# Files', extensions: ['cs']}
                    ]}, function (fileName) {
                    var auto = fileName;
                    svfullfileName = fileName;
                    var data = editor.doc.getValue();
                    
                    timer = setInterval(function (){fs.writeFile(fileName,editor.doc.getValue());},100);
                                                       
                                              
                  });
                 
                }
          },
          {
          type: 'separator'
          },
          {
            label: 'Print',
            accelerator: 'Ctrl+p',
            click : function print(){
              var text = document.getElementById("code");
              window.print(text);
            }
          },
          {
            type: 'separator'
          },
          {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
          },
          {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
          },
          
        ]
      },
      {
      label: 'Edit',
      submenu: [
         
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          //role: 'undo'
          click: function undo(){
            editor.execCommand('undo');
          }
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          click: function redo(){
            editor.execCommand('redo');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
          
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          click: function select(){
            editor.execCommand('selectall');
          }
        },
        {
          type: 'separator'
        },
        {
          label : 'Find',
          accelerator : 'Ctrl+F',
          click : function(){
            CodeMirror.commands.find(editor);
          }
        },
        {
          label : 'Find Next',
          accelerator : 'Ctrl+G',
          click : function(){
            editor.execCommand('findNext');
          }
        },
        {
          label : 'Find Previous',
          accelerator : 'Shift+Ctrl+G',
          click : function(){
            editor.execCommand('findPrev');
          }
        },
        {
          type: 'separator'
        },
        {
          label : 'Replace',
          accelerator : 'Shift+Ctrl+F',
          click : function(){
            editor.execCommand('replace');
          }
        },
        {
          label : 'Replace All',
          accelerator : 'Shift+Ctrl+R',
          click : function(){
            editor.execCommand('replaceAll');
          }
        },
        
      ]
    },
]
  
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)