/// <reference path="../model/ConfigStorage.ts" />
/// <reference path="../util/EventEmitter.ts" />

interface IConfigService extends util.IEventEmitter {
    getConfig(): IConfig;
    setSettings(configSettings: IConfig);
}

/**
 * events:
 *   - update(config: IConfig)
 */
class ConfigService extends util.EventEmitter implements IConfigService {

    private config: IConfig;

    constructor(
        private configStorage: IConfigStorage
    ) {
        super();
        this.config = this.configStorage.get();
    }

    getConfig(): IConfig {
        return this.config;
    }

    setSettings(configSettings: IConfig) {
        this.config.update(configSettings);
        this.configStorage.store(this.config);
        this.emitEvent('update', [this.config]);
    }

}
