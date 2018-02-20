// Initiates tabs the onready event is because the tabs 
// library does not allows the contents' dev tools to be open into parent window
// code.html contains the editor.
// Library used: https://www.npmjs.com/package/electron-tabs
const TabGroup = require("electron-tabs");
const bootstrap = require("bootstrap");
const dragula = require("dragula");


tabGroup = new TabGroup({
    ready: function (tabGroup) {
        dragula([tabGroup.tabContainer], {
            direction: "horizontal"
        });
    }
});

function addTab(title, active){
    let tab = tabGroup.addTab({
        title: title,
        src: './code.html',
        visible: true,
        active: false,
        webviewAttributes: {
            'nodeintegration': true
        },
        ready: tab => {
            // Open dev tools for webview
            let webview = tab.webview;

            if (!!webview) {
                webview.addEventListener('dom-ready', () => {
                    //webview.openDevTools();
                    tab.activate(active);
                })
            }
        }
    });
    
}
