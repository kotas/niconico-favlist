/// <reference path="./config.ts" />
/// <reference path="../infrastructure/data_storage.ts" />

class ConfigRepository {

    constructor(private storage: DataStorage) {
    }

    get(): Config {
        return new Config(
            this.storage.getInteger('checkInterval', Config.Default.checkInterval),
            this.storage.getInteger('maxNewVideos', Config.Default.maxNewVideos),
            this.storage.getBoolean('hideCheckedList', Config.Default.hideCheckedList),
            this.storage.getBoolean('orderDescendant', Config.Default.orderDescendant)
        );
    }

    store(config: Config) {
        this.storage.setInteger('checkInterval', config.getCheckInterval());
        this.storage.setInteger('maxNewVideos', config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
    }

}
