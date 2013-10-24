/// <reference path="../model/Mylist.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../util/Event.ts" />

interface ISubscriptionService {
    onUpdate: util.IEvent<{ mylist: Mylist; subscribed: boolean }>;
    checkUpdate(): void;
    isSubscribed(): boolean;
    subscribe();
    unsubscribe();
}

class SubscriptionService implements ISubscriptionService {

    onUpdate = new util.Event<{ mylist: Mylist; subscribed: boolean }>();

    private mylists: MylistCollection;

    constructor(
        private mylist: Mylist,
        private mylistCollectionStorage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval
    ) {
        this.mylists = this.mylistCollectionStorage.get();
        this.setEventHandlersForMylistCollectionStorage();
    }

    checkUpdate(): void {
        this.mylistCollectionStorage.checkUpdate();
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

    private setEventHandlersForMylistCollectionStorage() {
        this.mylistCollectionStorage.onUpdate.addListener(() => {
            var subscribed = this.isSubscribed();
            this.mylists = this.mylistCollectionStorage.get();
            if (subscribed !== this.isSubscribed()) {
                this.onUpdate.trigger(null);
            }
        });
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
            this.onUpdate.trigger({ mylist: this.mylist, subscribed: subscribed });
        }
    }

}
