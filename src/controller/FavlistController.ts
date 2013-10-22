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
    private favlistView: FavlistView;

    constructor(
        private config: IConfig,
        private configStorage: IConfigStorage,
        private mylistCollectionStorage: IMylistCollectionStorage,
        private mylistCollectionUpdater: IMylistCollectionUpdater
    ) {
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.favlistView = new FavlistView(this.config, this.mylistCollection, this.mylistCollectionUpdater);
        this.setEventHandlers();
    }

    start() {
        this.favlistView.show();
        this.favlistView.showMylistPage();
        this.mylistCollectionUpdater.updateAllIfExpired(this.mylistCollection);
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
            this.mylistCollectionUpdater.updateAll(this.mylistCollection);
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
        this.mylistCollectionUpdater.addListener('finishUpdateAll', () => {
            this.mylistCollectionStorage.store(this.mylistCollection);
        });
    }

    private setEventHandlersForSettingsView() {
        this.favlistView.addListener('settingSave', (savedMylists: IFavlistSettingSavedMylist[], savedConfig: IConfig) => {
            var newMylists: Mylist[] = [];
            savedMylists.forEach((savedMylist: IFavlistSettingSavedMylist) => {
                var mylist = this.mylistCollection.get(savedMylist.mylistId);
                if (mylist) {
                    mylist.setOverrideTitle(savedMylist.title);
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
