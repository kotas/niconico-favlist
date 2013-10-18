class Config {

    constructor(
        private checkInterval: number     = 30 * 60,
        private maxNewVideos: number      = 10,
        private hideCheckedList: boolean  = false,
        private orderDescendant: boolean  = false
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
