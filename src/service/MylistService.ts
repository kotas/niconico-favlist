/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />
/// <reference path="../model/MylistFeedFactory.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../util/Event.ts" />

interface IMylistService {
    onUpdate: util.IEvent<void>;
    onUpdateMylist: util.IEvent<{ mylist: Mylist }>;
    onStartUpdatingAll: util.IEvent<void>;
    onChangeMylistStatus: util.IEvent<{ mylist: Mylist; status: MylistStatus }>;
    onFinishUpdatingAll: util.IEvent<void>;
    checkUpdate(): void;
    getMylistCollection(): MylistCollection;
    setMylists(mylists: Mylist[]): void;
    updateAllIfExpired();
    updateAll();
    markMylistAllWatched(mylist: Mylist);
    markVideoWatched(mylist: Mylist, video: Video);
}

enum MylistStatus {
    Waiting,
    Updating,
    Finished,
    Private,
    Deleted,
    Error
}

class MylistService implements IMylistService {

    onUpdate = new util.Event<void>();
    onUpdateMylist = new util.Event<{ mylist: Mylist }>();
    onStartUpdatingAll = new util.Event<void>();
    onChangeMylistStatus = new util.Event<{ mylist: Mylist; status: MylistStatus }>();
    onFinishUpdatingAll = new util.Event<void>();

    private mylists: MylistCollection;
    private updater: MylistCollectionUpdater;

    constructor(
        private mylistsStorage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval,
        feedFactory: IMylistFeedFactory
    ) {
        this.mylists = this.mylistsStorage.get();
        this.updater = new MylistCollectionUpdater(feedFactory);
        this.setEventHandlersForMylistsStorage();
        this.setEventHandlersForUpdater();
    }

    checkUpdate(): void {
        this.mylistsStorage.checkUpdate();
    }

    getMylistCollection(): MylistCollection {
        return this.mylists;
    }

    setMylists(mylists: Mylist[]): void {
        this.mylists.setMylists(mylists);
        this.save();
        this.onUpdate.trigger(null);
    }

    updateAllIfExpired() {
        if (this.updateInterval.isExpired()) {
            this.updateAll();
        }
    }

    updateAll() {
        this.updateInterval.updateLastUpdateTime();
        this.updater.updateAll(this.mylists);
    }

    markMylistAllWatched(mylist: Mylist) {
        mylist.markAllVideosAsWatched();
        this.save();
        this.onUpdateMylist.trigger({ mylist: mylist });
    }

    markVideoWatched(mylist: Mylist, video: Video) {
        mylist.markVideoAsWatched(video);
        this.save();
        this.onUpdateMylist.trigger({ mylist: mylist });
    }

    private save() {
        this.mylistsStorage.store(this.mylists);
    }

    private setEventHandlersForMylistsStorage() {
        this.mylistsStorage.onUpdate.addListener(() => {
            this.mylists = this.mylistsStorage.get();
            this.onUpdate.trigger(null);
        });
    }

    private setEventHandlersForUpdater() {
        this.updater.onStartUpdatingAll.addListener(() => {
            this.onStartUpdatingAll.trigger(null);
            this.mylists.getMylists().forEach((mylist: Mylist) => {
                this.onChangeMylistStatus.trigger({ mylist: mylist, status: MylistStatus.Waiting });
            });
        });
        this.updater.onStartUpdatingMylist.addListener((args) => {
            this.onChangeMylistStatus.trigger({ mylist: args.mylist, status: MylistStatus.Updating });
        });
        this.updater.onFailedUpdatingMylist.addListener((args) => {
            var status = MylistStatus.Error;
            if (args.httpStatus === 403) {
                status = MylistStatus.Private;
            } else if (args.httpStatus === 404 || args.httpStatus === 410) {
                status = MylistStatus.Deleted;
            }
            this.onChangeMylistStatus.trigger({ mylist: args.mylist, status: status });
        });
        this.updater.onFinishUpdatingMylist.addListener((args) => {
            this.onChangeMylistStatus.trigger({ mylist: args.mylist, status: MylistStatus.Finished });
            this.onUpdateMylist.trigger({ mylist: args.mylist });
        });
        this.updater.onFinishUpdatingAll.addListener(() => {
            this.save();
            this.onFinishUpdatingAll.trigger(null);
        });
    }

}
