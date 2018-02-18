let textarea = document.getElementById("code");
let cm = require("codemirror");
let editor = cm.fromTextArea(document.getElementById("code"),  {
    mode: "javascript",
});
