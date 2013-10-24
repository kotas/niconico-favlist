/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="./Template.ts" />
/// <reference path="./ViewHelper.ts" />
/// <reference path="../util/Event.ts" />

class View {

    onShow = new util.Event<void>();

    constructor(public $el: JQuery) {}

    appendTo($parent: JQuery) {
        this.$el.appendTo($parent);
    }

    show() {
        this.update();
        this.$el.show();
        this.onShow.trigger(null);
    }

    update() {
    }

}
