/// <reference path="../storage/kvs/key_value_storage.ts" />
/// <reference path="../util/reader.ts" />
/// <reference path="../util/writer.ts" />
/// <reference path="../../domain/model/config/config.ts" />
/// <reference path="../../domain/model/config/config_repo.ts" />

class ConfigStorageRepository implements ConfigRepository {

    constructor(private storage: KeyValueStorage) {
    }

    get(): monapt.Future<Config> {
        return monapt.future<Config>(promise => {
            var defaults = Config.getDefault();
            var reader = new util.KVSReader(this.storage);
            promise.success(new Config(
                reader.readInteger('checkInterval').getOrElse(() => defaults.getCheckInterval()),
                reader.readInteger('maxNewVideos').getOrElse(() => defaults.getMaxNewVideos()),
                reader.readBoolean('hideCheckedList').getOrElse(() => defaults.isCheckedListHidden()),
                reader.readBoolean('orderDescendant').getOrElse(() => defaults.isOrderDescendant())
            ));
        });
    }

    store(config: Config): void {
        var writer = new util.KVSWriter(this.storage);
        writer.writeInteger('checkInterval',   config.getCheckInterval());
        writer.writeInteger('maxNewVideos',    config.getMaxNewVideos());
        writer.writeBoolean('hideCheckedList', config.isCheckedListHidden());
        writer.writeBoolean('orderDescendant', config.isOrderDescendant());
    }

}
