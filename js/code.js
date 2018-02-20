// Library used: RequireJS
// First version of iEdit loaded all the dependancies once, at the startup
// This was very bad idea so this version changes thigs by adding RequireJS which allows 
// Codemirror modules to be loaded dynamically when needed, effectively reducing statup time.
//let requirejs = require('requirejs');

requirejs([
    "../cm/lib/codemirror", "../cm/mode/javascript/javascript"
], function(CodeMirror) {
    let editor = CodeMirror(document.getElementById("code"),  {
        mode: "javascript",
        theme: "hopscotch"
    });
});
