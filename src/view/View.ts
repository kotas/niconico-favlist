/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="../util/EventEmitter.ts" />
/// <reference path="./Template.ts" />
/// <reference path="./ViewHelper.ts" />

interface IView extends util.IEventEmitter {
    appendTo($parent: JQuery);
    show();
    update();
}

class View extends util.EventEmitter implements IView {

    constructor(public $el: JQuery) {
        super();
    }

    appendTo($parent: JQuery) {
        this.$el.appendTo($parent);
    }

    show() {
        this.update();
        this.$el.show();
        this.emitEvent('show');
    }

    update() {
    }

}
