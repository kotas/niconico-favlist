/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="./Template.ts" />
/// <reference path="./ViewHelper.ts" />
/// <reference path="../util/Event.ts" />

class View {

    onShow = new util.Event<void>();
    onHide = new util.Event<void>();

    constructor(public $el: JQuery) {}

    appendTo($parent: JQuery) {
        this.$el.appendTo($parent);
    }

    isVisible(): boolean {
        return this.$el.is(':visible');
    }

    isHidden(): boolean {
        return this.$el.is(':hidden');
    }

    show() {
        this.update();
        this.$el.show();
        this.onShow.trigger(null);
    }

    hide() {
        this.$el.hide();
        this.onHide.trigger(null);
    }

    update() {
    }

}
