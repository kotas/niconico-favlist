/// <reference path="../util/Storage.ts" />

class UpdateInterval {

    constructor(
        private storage: util.IStorage,
        private checkInterval: number
    ) {
    }

    isExpired(): boolean {
        var currentTime = this.getCurrentTimeInSeconds();
        var lastUpdate  = this.getLastUpdateTime();
        return (lastUpdate === null || lastUpdate + this.checkInterval < currentTime);
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
