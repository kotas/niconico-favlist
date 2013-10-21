/// <reference path="../util/Storage.ts" />
/// <reference path="./Config.ts" />

interface IConfigStorage {
    get(): IConfig;
    store(config: IConfig): void;
}

class ConfigStorage implements IConfigStorage {

    private storage: util.TypedStorage;

    constructor(storage: util.IStorage) {
        this.storage = new util.TypedStorage(storage);
    }

    get(): IConfig {
        return new Config(
            this.storage.getInteger('checkInterval'),
            this.storage.getInteger('maxNewVideos'),
            this.storage.getBoolean('hideCheckedList'),
            this.storage.getBoolean('orderDescendant')
        );
    }

    store(config: IConfig): void {
        this.storage.setInteger('checkInterval',   config.getCheckInterval());
        this.storage.setInteger('maxNewVideos',    config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
    }

}
