/// <reference path="../util/Storage.ts" />
/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../model/Config.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../view/FavlistView.ts" />

class FavlistController {

    private storage: util.IStorage;
    private configStorage: ConfigStorage;
    private config: Config;
    private mylistCollectionStorage: MylistCollectionStorage;
    private mylistCollection: MylistCollection;
    private favlistView: FavlistView;

    constructor() {
        this.storage = util.chooseStorage();
        this.configStorage = new ConfigStorage(this.storage);
        this.config = this.configStorage.get();
        this.mylistCollectionStorage = new MylistCollectionStorage(this.storage);
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.favlistView = new FavlistView();
    }

    start() {
        this.favlistView.show();
        this.favlistView.showMylistPage(this.mylistCollection);
    }

}
