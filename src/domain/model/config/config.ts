class Config {

    static getDefault(): Config {
        return new Config(
            30 * 60,
            10,
            false,
            false
        );
    }

    constructor(
        private checkInterval: number,
        private maxNewVideos: number,
        private hideCheckedList: boolean,
        private orderDescendant: boolean
    ) {
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

}
