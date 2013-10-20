/// <reference path="../util/Storage.ts" />
/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../model/Config.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollection.ts" />

class RegisterController {

    private storage: util.IStorage;
    private configStorage: ConfigStorage;
    private config: Config;
    private mylistCollectionStorage: MylistCollectionStorage;
    private mylistCollection: MylistCollection;

    constructor() {
        this.storage = util.chooseStorage();
        this.configStorage = new ConfigStorage(this.storage);
        this.config = this.configStorage.get();
        this.mylistCollectionStorage = new MylistCollectionStorage(this.storage);
        this.mylistCollection = this.mylistCollectionStorage.get();
    }

    start() {
    }

}
