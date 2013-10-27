/// <reference path="./DI.ts" />
/// <reference path="./UserScriptApp.ts" />

$(function () {
    var app = new userscript.UserScriptApp(new userscript.DI());
    app.start();
});
