/// <reference path="./Config.ts" />

class ConfigSerializer {

    unserialize(serialized: string): Config {
        var data = serialized.split(':');
        return new Config(
            parseInt(data[0], 10),
            parseInt(data[1], 10),
            data[2] !== '0',
            data[3] !== '0'
        );
    }

    serialize(config: IConfig): string {
        return [
            config.getCheckInterval().toString(),
            config.getMaxNewVideos().toString(),
            config.isCheckedListHidden() ? '1' : '0',
            config.isOrderDescendant() ? '1' : '0'
        ].join(':');
    }

}
