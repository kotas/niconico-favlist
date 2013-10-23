/// <reference path="../service/SubscriptionService.ts" />
/// <reference path="./NicovideoGlue.ts" />

module userscript {

    export class UserScriptSubscriptionService extends SubscriptionService {

        constructor(
            mylistCollectionStorage: IMylistCollectionStorage,
            updateInterval: IUpdateInterval
        ) {
            super(NicovideoGlue.createMylistFromPage(), mylistCollectionStorage, updateInterval);
        }

    }

}
