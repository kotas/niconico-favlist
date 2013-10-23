/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="../util/EventEmitter.ts" />
/// <reference path="./Template.ts" />
/// <reference path="./ViewHelper.ts" />

class Subview extends util.EventEmitter {

    constructor(public $el: JQuery) {
        super();
    }

    appendTo($parent: JQuery) {
        this.$el.appendTo($parent);
    }

}
