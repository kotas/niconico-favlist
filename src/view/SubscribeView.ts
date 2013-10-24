/// <reference path="./View.ts" />
/// <reference path="../service/SubscriptionService.ts" />

class SubscribeView extends View {

    onSubscribeRequest = new util.Event<void>();
    onUnsubscribeRequest = new util.Event<void>();

    constructor(
        private subscriptionService: ISubscriptionService
    ) {
        super(Template.load(Templates.subscribe));
        this.setEventHandlers();
    }

    update() {
        this.$el.toggleClass('subscribed', this.subscriptionService.isSubscribed());
    }

    private setEventHandlers() {
        this.setEventHandlersForView();
        this.setEventHandlersForSubscription();
    }

    private setEventHandlersForView() {
        this.$el.find('.favlistSubscribeButton').click(() => {
            this.onSubscribeRequest.trigger(null);
            return false;
        });
        this.$el.find('.favlistUnsubscribeButton').click(() => {
            this.onUnsubscribeRequest.trigger(null);
            return false;
        });
    }

    private setEventHandlersForSubscription() {
        this.subscriptionService.onUpdate.addListener(() => {
            this.update();
        });
    }

}
