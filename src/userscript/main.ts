/// <reference path="./DI.ts" />
/// <reference path="./UserScriptApp.ts" />

var DI: IFavlistDI = new userscript.DI();

$(function () {
    var app = new userscript.UserScriptApp();
    app.start();
});
