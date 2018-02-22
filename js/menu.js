const { remote } = require('electron')
const { Menu, MenuItem } = remote

// You can not access the DOM element of child or guest page. All you can do is pass the message and order it.
// That is why, instead of getting the 'editor' object I am sending the command to respective page, and the,
// page will carry out operation to that page. More neat.
// Webview == guestpage. ;)

function order(command) {
  // this line however named getCurrentTab will return the webview of the tab. && //Sending the message.
  activeWebview = tabGroup.getActiveTab().webview;
  activeWebview.send(command);
}


//Menu template. Very Long. :)

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'Ctrl+O',
        click: function openFile() {
          order('showOpenDialog');
          //Setting listner for opened file-name which can be used to setup file name.
          
        }
      },
      {
        label: 'Save',
        accelerator: 'Ctrl+S',
        click: () =>{
          order('save');
        }
      },
      {
        label: 'Save As...',
        accelerator: 'Ctrl+Shift+S',
        click: function saveFile() {
          order('showSaveDialog');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Print',
        accelerator: 'Ctrl+p',
        click: function print() {
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
        click: function undo() {
          order('undo');
        }
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        click: function redo() {
          order('redo');
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
        click: function select() {
          order('selectall');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Find',
        accelerator: 'Ctrl+F',
        click: function () {
          order('find');
        }
      },
      {
        label: 'Find Next',
        accelerator: 'Ctrl+G',
        click: function () {
          order('findNext');
        }
      },
      {
        label: 'Find Previous',
        accelerator: 'Shift+Ctrl+G',
        click: function () {
          order('findPrev');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Replace',
        accelerator: 'Shift+Ctrl+F',
        click: function () {
          order('replace');
        }
      },
      {
        label: 'Replace All',
        accelerator: 'Shift+Ctrl+R',
        click: function () {
          order('replaceAll');
        }
      },
      {
        label: 'Autoclose tags, brackets.',
        
        type: 'checkbox',
        click: function () {
          order('autoclose');
        }
      },
    ]
  },
  {
    label: 'View'

  }
]


const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
