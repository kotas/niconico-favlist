/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />
/// <reference path="../model/MylistFeedFactory.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../util/EventEmitter.ts" />

interface IMylistService extends util.IEventEmitter {
    getMylistCollection(): MylistCollection;
    setSettings(mylistSetting: IMylistSetting[]);
    updateAllIfExpired();
    updateAll();
    markMylistAllWatched(mylist: Mylist);
    markVideoWatched(mylist: Mylist, video: Video);
}

interface IMylistSetting {
    mylistId: MylistId;
    title: string;
}

enum MylistStatus {
    Waiting,
    Updating,
    Finished,
    Private,
    Error
}

/**
 * events:
 *   - update(mylistCollection: MylistCollection)
 *   - startUpdateAll(mylistCollection: MylistCollection)
 *   - changeMylistStatus(mylist: Mylist, status: MylistUpdateStatus)
 *   - finishUpdateAll(mylistCollection: MylistCollection)
 */
class MylistService extends util.EventEmitter implements IMylistService {

    private mylists: MylistCollection;
    private updater: MylistCollectionUpdater;

    constructor(
        private storage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval,
        feedFactory: IMylistFeedFactory
    ) {
        super();
        this.mylists = this.storage.get();
        this.updater = new MylistCollectionUpdater(feedFactory);
        this.setEventHandlersForUpdater();
    }

    getMylistCollection(): MylistCollection {
        return this.mylists;
    }

    setSettings(mylistSetting: IMylistSetting[]) {
        var newMylists: Mylist[] = [];
        mylistSetting.forEach((mylistSetting: IMylistSetting) => {
            var mylist: Mylist = this.mylists.get(mylistSetting.mylistId);
            if (mylist) {
                mylist.setOverrideTitle(mylistSetting.title);
                newMylists.push(mylist);
            }
        });
        this.mylists.setMylists(newMylists);
        this.save();
        this.emitEvent('updateMylists', [this.mylists]);
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
    }

    markVideoWatched(mylist: Mylist, video: Video) {
        mylist.markVideoAsWatched(video);
        this.save();
    }

    private save() {
        this.storage.store(this.mylists);
    }

    private setEventHandlersForUpdater() {
        var changeMylistStatus = (mylist: Mylist, status: MylistStatus) => {
            this.emitEvent('changeMylistStatus', [mylist, status]);
        };

        this.updater.addListener('startUpdateAll', () => {
            this.emitEvent('startUpdateAll', [this.mylists]);
            this.mylists.getMylists().forEach((mylist: Mylist) => {
                changeMylistStatus(mylist, MylistStatus.Waiting);
            });
        });
        this.updater.addListener('startUpdateMylist', (mylist: Mylist) => {
            changeMylistStatus(mylist, MylistStatus.Updating);
        });
        this.updater.addListener('failedUpdateMylist', (mylist: Mylist, error: MylistFeedFetchError) => {
            if (error.httpStatus === 403) {
                changeMylistStatus(mylist, MylistStatus.Private);
            } else {
                changeMylistStatus(mylist, MylistStatus.Error);
            }
        });
        this.updater.addListener('finishUpdateMylist', (mylist: Mylist) => {
            changeMylistStatus(mylist, MylistStatus.Finished);
        });
        this.updater.addListener('finishUpdateAll', () => {
            this.save();
            this.emitEvent('finishUpdateAll', [this.mylists]);
        });
    }

}
