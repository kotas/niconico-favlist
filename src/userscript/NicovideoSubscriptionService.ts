/// <reference path="../service/SubscriptionService.ts" />
/// <reference path="./NicovideoGlue.ts" />

class NicovideoSubscriptionService extends SubscriptionService {

    constructor(
        mylistCollectionStorage: IMylistCollectionStorage,
        updateInterval: IUpdateInterval
    ) {
        super(NicovideoGlue.createMylistFromPage(), mylistCollectionStorage, updateInterval);
    }

}
