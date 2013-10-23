/// <reference path="../model/Mylist.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../util/EventEmitter.ts" />

interface ISubscriptionService extends util.IEventEmitter {
    isSubscribed(): boolean;
    subscribe();
    unsubscribe();
}

/**
 * events:
 *   - update(subscribed: boolean)
 */
class SubscriptionService extends util.EventEmitter implements ISubscriptionService {

    private mylists: MylistCollection;

    constructor(
        private mylist: Mylist,
        private mylistCollectionStorage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval
    ) {
        super();
        this.mylists = this.mylistCollectionStorage.get();
    }

    isSubscribed(): boolean {
        return this.mylists.contains(this.mylist.getMylistId());
    }

    subscribe() {
        this.setSubscribed(true);
    }

    unsubscribe() {
        this.setSubscribed(false);
    }

    private setSubscribed(subscribed: boolean) {
        this.mylists = this.mylistCollectionStorage.get();
        if (subscribed !== this.isSubscribed()) {
            if (subscribed) {
                this.mylists.add(this.mylist);
            } else {
                this.mylists.removeById(this.mylist.getMylistId());
            }
            this.mylistCollectionStorage.store(this.mylists);
            this.updateInterval.expire();
            this.emitEvent('update', [subscribed]);
        }
    }

}
