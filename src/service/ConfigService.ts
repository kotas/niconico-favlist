/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../util/Event.ts" />

interface IConfigService {
    onUpdate: util.IEvent<{ config: IConfig }>;
    getConfig(): IConfig;
    setSettings(configSettings: IConfig);
}

class ConfigService implements IConfigService {

    onUpdate = new util.Event<{ config: IConfig }>();

    private config: IConfig;

    constructor(private configStorage: IConfigStorage) {
        this.config = this.configStorage.get();
    }

    getConfig(): IConfig {
        return this.config;
    }

    setSettings(configSettings: IConfig) {
        this.config.update(configSettings);
        this.configStorage.store(this.config);
        this.onUpdate.trigger({ config: this.config });
    }

}
