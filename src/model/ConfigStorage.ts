/// <reference path="../util/Storage.ts" />
/// <reference path="./Config.ts" />

class ConfigStorage {

    private storage: util.TypedStorage;

    constructor(storage: util.IStorage) {
        this.storage = new util.TypedStorage(storage);
    }

    get(): Config {
        return new Config(
            this.storage.getInteger('checkInterval'),
            this.storage.getInteger('maxNewVideos'),
            this.storage.getBoolean('hideCheckedList'),
            this.storage.getBoolean('orderDescendant')
        );
    }

    store(config: Config): void {
        this.storage.setInteger('checkInteval',    config.getCheckInterval());
        this.storage.setInteger('maxNewVideos',    config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
    }

}
