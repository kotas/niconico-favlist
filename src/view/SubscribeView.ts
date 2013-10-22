/// <reference path="./View.ts" />

/**
 * events:
 *   - subscribeRequest()
 *   - unsubscribeRequest()
 */
class SubscribeView extends View {

    private subscribed: boolean = false;

    constructor() {
        super(SubscribeView.findParent(), Template.load(Templates.subscribe));
        this.setEventHandlers();
    }

    setSubscribed(subscribed: boolean) {
        if (this.subscribed !== subscribed) {
            this.subscribed = subscribed;
            this.$el.toggleClass('subscribed', this.subscribed);
        }
    }

    private setEventHandlers() {
        this.$el.find('.favlistSubscribeButton').click(() => {
            this.emitEvent('subscribeRequest');
            return false;
        });
        this.$el.find('.favlistUnsubscribeButton').click(() => {
            this.emitEvent('unsubscribeRequest');
            return false;
        });
    }

    private static findParent(): JQuery {
        var $parent = $('.content_312').eq(0);
        if ($parent.length > 0) {
            return $('<div />').css({
                'padding': '10px',
                'text-align': 'center'
            }).prependTo($parent);
        }

        $parent = $('#watchBtns').eq(0);
        if ($parent.length > 0) {
            return $('<div />').css({
                'display': 'inline-block',
                'margin-left': '8px'
            }).insertAfter($parent);
        }

        $parent = Template.load(Templates.subscribe_rescue);
        $parent.appendTo(document.body);
        return $parent;
    }

}
