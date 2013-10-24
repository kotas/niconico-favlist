/// <reference path="../util/Storage.ts" />
/// <reference path="../util/Event.ts" />
/// <reference path="./Config.ts" />

interface IConfigStorage {
    onUpdate: util.IEvent<void>;
    checkUpdate(): void;
    get(): IConfig;
    store(config: IConfig): void;
}

class ConfigStorage implements IConfigStorage {

    onUpdate = new util.Event<void>();

    private storage: util.TypedStorage;
    private updateTime: util.UpdateTimeStorage;

    constructor(storage: util.IStorage) {
        this.storage = new util.TypedStorage(storage);
        this.updateTime = new util.UpdateTimeStorage(storage, 'configLastUpdateTime');
    }

    checkUpdate(): void {
        if (this.updateTime.isChanged()) {
            this.updateTime.fetch();
            this.onUpdate.trigger(null);
        }
    }

    get(): IConfig {
        var config = new Config(
            this.storage.getInteger('checkInterval'),
            this.storage.getInteger('maxNewVideos'),
            this.storage.getBoolean('hideCheckedList'),
            this.storage.getBoolean('orderDescendant')
        );
        this.updateTime.fetch();
        return config;
    }

    store(config: IConfig): void {
        this.storage.setInteger('checkInterval',   config.getCheckInterval());
        this.storage.setInteger('maxNewVideos',    config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
        this.updateTime.update();
    }

}
