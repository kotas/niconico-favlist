/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="../util/EventEmitter.ts" />
/// <reference path="./Template.ts" />
/// <reference path="./ViewHelper.ts" />

class View extends util.EventEmitter {

    constructor(public $parent: JQuery, public $el: JQuery) {
        super();
    }

    show() {
        this.update();
        if (this.$el.parents('html').length === 0) {
            this.$el.appendTo(this.$parent);
        }
        this.$el.show();
    }

    update() {
    }

}
