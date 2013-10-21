
interface IConfig {
    update(config: IConfig): void;
    getCheckInterval(): number;
    getMaxNewVideos(): number;
    isCheckedListHidden(): boolean;
    isOrderDescendant(): boolean;
    getUserAgent(): string;
}

class Config implements IConfig {

    constructor(
        private checkInterval: number     = 30 * 60,
        private maxNewVideos: number      = 10,
        private hideCheckedList: boolean  = false,
        private orderDescendant: boolean  = false
    ) {
    }

    update(config: IConfig): void {
        this.checkInterval   = config.getCheckInterval();
        this.maxNewVideos    = config.getMaxNewVideos();
        this.hideCheckedList = config.isCheckedListHidden();
        this.orderDescendant = config.isOrderDescendant();
    }

    getCheckInterval(): number {
        return this.checkInterval;
    }

    getMaxNewVideos(): number {
        return this.maxNewVideos;
    }

    isCheckedListHidden(): boolean {
        return this.hideCheckedList;
    }

    isOrderDescendant(): boolean {
        return this.orderDescendant;
    }

    getUserAgent(): string {
        var s: string;
        if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.name && GM_info.script.version) {
            s = GM_info.script.name + '/' + GM_info.script.version + ' Greasemonkey';
        } else {
            s = 'NicoNicoFavlist';
        }
        if (typeof window.navigator !== 'undefined' && window.navigator.userAgent) {
            s += ' ' + window.navigator.userAgent;
        }
        return s;
    }

}
