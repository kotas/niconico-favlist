/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="./Template.ts" />
/// <reference path="./ViewHelper.ts" />
/// <reference path="../util/Event.ts" />

class Subview {

    constructor(public $el: JQuery) {}

    appendTo($parent: JQuery) {
        this.$el.appendTo($parent);
    }

}
