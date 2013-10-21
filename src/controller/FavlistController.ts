/// <reference path="../util/Storage.ts" />
/// <reference path="../util/UrlFetcher.ts" />
/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../model/Config.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />
/// <reference path="../model/MylistFeedFactory.ts" />
/// <reference path="../view/FavlistView.ts" />

class FavlistController {

    private storage: util.IStorage;
    private configStorage: ConfigStorage;
    private config: Config;
    private mylistCollectionStorage: MylistCollectionStorage;
    private mylistCollection: MylistCollection;
    private mylistCollectionUpdater: MylistCollectionUpdater;
    private favlistView: FavlistView;

    constructor() {
        this.storage = util.chooseStorage();
        this.configStorage = new ConfigStorage(this.storage);
        this.config = this.configStorage.get();
        this.mylistCollectionStorage = new MylistCollectionStorage(this.storage);
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.mylistCollectionUpdater = new MylistCollectionUpdater(
            new UpdateInterval(this.storage, this.config.getCheckInterval()),
            this.mylistCollection,
            new MylistFeedFactory(util.chooseUrlFetcher(this.config.getUserAgent()))
        );
        this.favlistView = new FavlistView(this.mylistCollection, this.config);
        this.setEventHandlers();
    }

    start() {
        this.favlistView.show();
        this.favlistView.showMylistPage();
        this.mylistCollectionUpdater.updateAllIfExpired();
    }

    private setEventHandlers() {
        this.favlistView.addListener('settingPageRequest', () => {
            this.favlistView.showSettingPage();
        });
        this.favlistView.addListener('checkNowRequest', () => {
            this.mylistCollectionUpdater.updateAll(() => {
                this.mylistCollectionStorage.store(this.mylistCollection);
            });
        });
        this.favlistView.addListener('mylistClearRequest', (mylist: Mylist) => {
            mylist.markAllVideosAsWatched();
            this.mylistCollectionStorage.store(this.mylistCollection);
        });
        this.favlistView.addListener('mylistVideoWatch', (mylist: Mylist, video: Video) => {
            mylist.markVideoAsWatched(video);
            this.mylistCollectionStorage.store(this.mylistCollection);
        });

        var updateMylistViewStatus = (mylist: Mylist, status: string, dismiss: boolean = false): FavlistMylistsMylistView => {
            var collectionView = this.favlistView.getMylistCollectionView();
            var mylistView = collectionView.getMylistView(mylist.getMylistId());
            if (!mylistView) return null;
            if (status !== null) {
                mylistView.showStatus(status, dismiss);
            } else {
                mylistView.hideStatus();
            }
            return mylistView;
        };
        this.mylistCollectionUpdater.addListener('startUpdateAll', () => {
            this.favlistView.lock();
            this.mylistCollection.getMylists().forEach((mylist: Mylist) => {
                updateMylistViewStatus(mylist, 'waiting');
            });
        });
        this.mylistCollectionUpdater.addListener('startUpdateMylist', (mylist: Mylist) => {
            updateMylistViewStatus(mylist, 'updating');
        });
        this.mylistCollectionUpdater.addListener('failedUpdateMylist', (mylist: Mylist, error: MylistFeedFetchError) => {
            updateMylistViewStatus(mylist, 'failed', true);
        });
        this.mylistCollectionUpdater.addListener('finishUpdateMylist', (mylist: Mylist) => {
            updateMylistViewStatus(mylist, null);
        });
        this.mylistCollectionUpdater.addListener('finishUpdateAll', () => {
            this.mylistCollectionStorage.store(this.mylistCollection);
            this.favlistView.unlock();
        });
    }

}
