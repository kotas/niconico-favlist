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
    Deleted,
    Error
}

/**
 * events:
 *   - update()
 *   - updateMylist(mylist: Mylist)
 *   - startUpdateAll()
 *   - changeMylistStatus(mylist: Mylist, status: MylistUpdateStatus)
 *   - finishUpdateAll()
 */
class MylistService extends util.EventEmitter implements IMylistService {

    private mylists: MylistCollection;
    private updater: MylistCollectionUpdater;

    constructor(
        private mylistsStorage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval,
        feedFactory: IMylistFeedFactory
    ) {
        super();
        this.mylists = this.mylistsStorage.get();
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
        this.emitEvent('update');
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
        this.emitEvent('updateMylist', [mylist]);
    }

    markVideoWatched(mylist: Mylist, video: Video) {
        mylist.markVideoAsWatched(video);
        this.save();
        this.emitEvent('updateMylist', [mylist]);
    }

    private save() {
        this.mylistsStorage.store(this.mylists);
    }

    private setEventHandlersForUpdater() {
        var changeMylistStatus = (mylist: Mylist, status: MylistStatus) => {
            this.emitEvent('changeMylistStatus', [mylist, status]);
        };

        this.updater.addListener('startUpdateAll', () => {
            this.emitEvent('startUpdateAll');
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
            } else if (error.httpStatus === 404 || error.httpStatus === 410) {
                changeMylistStatus(mylist, MylistStatus.Deleted);
            } else {
                changeMylistStatus(mylist, MylistStatus.Error);
            }
        });
        this.updater.addListener('finishUpdateMylist', (mylist: Mylist) => {
            changeMylistStatus(mylist, MylistStatus.Finished);
            this.emitEvent('updateMylist', [mylist]);
        });
        this.updater.addListener('finishUpdateAll', () => {
            this.save();
            this.emitEvent('finishUpdateAll');
        });
    }

}
