/// <reference path="./View.ts" />
/// <reference path="../service/SubscriptionService.ts" />

/**
 * events:
 *   - subscribeRequest()
 *   - unsubscribeRequest()
 */
class SubscribeView extends View {

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
            this.emitEvent('subscribeRequest');
            return false;
        });
        this.$el.find('.favlistUnsubscribeButton').click(() => {
            this.emitEvent('unsubscribeRequest');
            return false;
        });
    }

    private setEventHandlersForSubscription() {
        this.subscriptionService.addListener('update', () => {
            this.update();
        });
    }

}
