/// <reference path="../util/Storage.ts" />
/// <reference path="./Config.ts" />

interface IUpdateInterval {
    isExpired(): boolean;
    expire(): void;
    updateLastUpdateTime(): void;
    getLastUpdateTime(): number;
}

class UpdateInterval implements IUpdateInterval {

    constructor(
        private storage: util.IStorage,
        private config: IConfig
    ) {
    }

    isExpired(): boolean {
        var currentTime = this.getCurrentTimeInSeconds();
        var lastUpdate  = this.getLastUpdateTime();
        return (lastUpdate === null || lastUpdate + this.config.getCheckInterval() < currentTime);
    }

    expire(): void {
        this.storage.set('lastUpdate', '0');
    }

    updateLastUpdateTime(): void {
        this.storage.set('lastUpdate', this.getCurrentTimeInSeconds().toString());
    }

    getLastUpdateTime(): number {
        var lastUpdate: string = this.storage.get('lastUpdate');
        if (typeof lastUpdate === 'undefined') {
            return null;
        } else {
            var time: number = parseInt(lastUpdate);
            return isNaN(time) ? null : time;
        }
    }

    private getCurrentTimeInSeconds(): number {
        return Math.floor((new Date()).getTime() / 1000);
    }

}
