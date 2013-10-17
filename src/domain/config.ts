class Config {

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
