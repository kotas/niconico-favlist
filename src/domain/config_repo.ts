/// <reference path="./config.ts" />
/// <reference path="../infrastructure/data_storage.ts" />

class ConfigRepository {

    constructor(private storage: DataStorage) {
    }

    get(): Config {
        return new Config(
            this.storage.getInteger('checkInterval',   30 * 60),
            this.storage.getInteger('maxNewVideos',    10),
            this.storage.getBoolean('hideCheckedList', false),
            this.storage.getBoolean('orderDescendant', false)
        );
    }

    store(config: Config) {
        this.storage.setInteger('checkInterval',   config.getCheckInterval());
        this.storage.setInteger('maxNewVideos',    config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
    }

}
