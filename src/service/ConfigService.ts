/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../util/Event.ts" />

interface IConfigService {
    onUpdate: util.IEvent<void>;
    checkUpdate(): void;
    getConfig(): IConfig;
    setConfig(config: IConfig): void;
}

class ConfigService implements IConfigService {

    onUpdate = new util.Event<void>();

    private config: IConfig;

    constructor(private configStorage: IConfigStorage) {
        this.config = this.configStorage.get();
        this.setEventHandlersForConfigStorage();
    }

    private setEventHandlersForConfigStorage() {
        this.configStorage.onUpdate.addListener(() => {
            this.config = this.configStorage.get();
            this.onUpdate.trigger(null);
        });
    }

    checkUpdate(): void {
        this.configStorage.checkUpdate();
    }

    getConfig(): IConfig {
        return this.config;
    }

    setConfig(config: IConfig) {
        this.config.update(config);
        this.configStorage.store(this.config);
        this.onUpdate.trigger(null);
    }

}
