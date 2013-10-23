/// <reference path="../view/SubscribeView.ts" />
/// <reference path="../service/SubscriptionService.ts" />

interface ISubscribeController {
    getView(): ISubscribeView;
    start();
}

class SubscribeController implements ISubscribeController {

    constructor(
        private subscribeView: ISubscribeView,
        private subscriptionService: ISubscriptionService
    ) {
        this.setEventHandlersForView();
    }

    getView(): ISubscribeView {
        return this.subscribeView;
    }

    start() {
        this.subscribeView.show();
    }

    private setEventHandlersForView() {
        this.subscribeView.addListener('subscribeRequest', () => {
            this.subscriptionService.subscribe();
        });
        this.subscribeView.addListener('unsubscribeRequest', () => {
            this.subscriptionService.unsubscribe();
        });
    }

}
