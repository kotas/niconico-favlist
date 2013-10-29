/// <reference path="../IFavlistDI.ts" />
/// <reference path="../view/SubscribeView.ts" />
/// <reference path="../service/SubscriptionService.ts" />

class SubscribeController {

    private subscribeView: SubscribeView;
    private subscriptionService: ISubscriptionService = DI.getSubscriptionService();

    start() {
        this.getView().show();
        this.observeUpdate();
    }

    getView(): SubscribeView {
        if (!this.subscribeView) {
            this.subscribeView = new SubscribeView(this.subscriptionService);
            this.setEventHandlersForView();
        }
        return this.subscribeView;
    }

    private observeUpdate() {
        var updateInteval = 5000;
        var checkUpdate = () => {
            this.subscriptionService.checkUpdate();
            setTimeout(checkUpdate, updateInteval);
        };
        setTimeout(checkUpdate, updateInteval);
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
