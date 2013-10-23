/// <reference path="../view/SubscribeView.ts" />
/// <reference path="./NicovideoGlue.ts" />

class NicovideoSubscribeView extends SubscribeView {

    constructor(
        subscriptionService: ISubscriptionService
    ) {
        super(subscriptionService);
        this.appendTo(NicovideoGlue.getSubscriveViewParent());
    }

}
