/// <reference path="./config.ts" />
/// <reference path="../../infrastructure/data_storage.ts" />

class ConfigRepository {

    constructor(private storage: DataStorage) {
    }

    get(): Config {
        return new Config(
            this.storage.getInteger('checkInterval'),
            this.storage.getInteger('maxNewVideos'),
            this.storage.getBoolean('hideCheckedList'),
            this.storage.getBoolean('orderDescendant')
        );
    }

    store(config: Config) {
        this.storage.setInteger('checkInterval',   config.getCheckInterval());
        this.storage.setInteger('maxNewVideos',    config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
    }

}
