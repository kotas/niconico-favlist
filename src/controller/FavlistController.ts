/// <reference path="../model/Config.ts" />
/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../model/MylistFeedFactory.ts" />
/// <reference path="../view/FavlistView.ts" />

interface IFavlistController {
    start();
}

class FavlistController implements IFavlistController {

    private mylistCollection: MylistCollection;
    private mylistCollectionUpdater: MylistCollectionUpdater;
    private favlistView: FavlistView;

    constructor(
        private config: IConfig,
        private configStorage: IConfigStorage,
        private mylistCollectionStorage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval,
        private mylistFeedFactory: IMylistFeedFactory
    ) {
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.mylistCollectionUpdater = new MylistCollectionUpdater(
            this.updateInterval,
            this.mylistFeedFactory,
            this.mylistCollection
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
        this.setEventHandlersForMylistsView();
        this.setEventHandlersForMylistCollectionUpdater();
        this.setEventHandlersForSettingsView();
    }

    private setEventHandlersForMylistsView() {
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
    }

    private setEventHandlersForMylistCollectionUpdater() {
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

    private setEventHandlersForSettingsView() {
        this.favlistView.addListener('settingSave', (savedMylists: IFavlistSettingSavedMylist[], savedConfig: IConfig) => {
            var newMylists: Mylist[] = [];
            savedMylists.forEach((savedMylist: IFavlistSettingSavedMylist) => {
                var mylist = this.mylistCollection.get(savedMylist.mylistId);
                if (mylist) {
                    mylist.setDisplayTitle(savedMylist.title);
                    newMylists.push(mylist);
                }
            });
            this.mylistCollection.setMylists(newMylists);
            this.mylistCollectionStorage.store(this.mylistCollection);

            this.config.update(savedConfig);
            this.configStorage.store(this.config);

            this.favlistView.showMylistPage();
        });

        this.favlistView.addListener('settingCancel', () => {
            this.favlistView.showMylistPage();
        });
    }

}