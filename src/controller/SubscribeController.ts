/// <reference path="../view/SubscribeView.ts" />
/// <reference path="../service/SubscriptionService.ts" />

class SubscribeController {

    private subscribeView: SubscribeView;

    constructor(
        private subscriptionService: ISubscriptionService
    ) {}

    start() {
        this.getView().show();
    }

    getView(): SubscribeView {
        if (!this.subscribeView) {
            this.subscribeView = new SubscribeView(this.subscriptionService);
            this.setEventHandlersForView();
        }
        return this.subscribeView;
    }

    private setEventHandlersForView() {
        this.subscribeView.onSubscribeRequest.addListener(() => {
            this.subscriptionService.subscribe();
        });
        this.subscribeView.onUnsubscribeRequest.addListener(() => {
            this.subscriptionService.unsubscribe();
        });
    }

}
