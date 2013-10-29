
interface IConfig {
    update(config: IConfig): void;
    getCheckInterval(): number;
    getMaxNewVideos(): number;
    isCheckedListHidden(): boolean;
    isOrderDescendant(): boolean;
}

class Config implements IConfig {

    private checkInterval: number;
    private maxNewVideos: number;
    private hideCheckedList: boolean;
    private orderDescendant: boolean;

    constructor(
        checkInterval: number     = 30 * 60,
        maxNewVideos: number      = 10,
        hideCheckedList: boolean  = false,
        orderDescendant: boolean  = false
    ) {
        this.setCheckInterval(checkInterval);
        this.setMaxNewVideos(maxNewVideos);
        this.setCheckedListHidden(hideCheckedList);
        this.setOrderDescendant(orderDescendant);
    }

    update(config: IConfig): void {
        this.setCheckInterval(config.getCheckInterval());
        this.setMaxNewVideos(config.getMaxNewVideos());
        this.setCheckedListHidden(config.isCheckedListHidden());
        this.setOrderDescendant(config.isOrderDescendant());
    }

    getCheckInterval(): number {
        return this.checkInterval;
    }

    private setCheckInterval(value: number) {
        if (isNaN(value) || value < 0) {
            throw new Error('更新チェック間隔が正の整数ではありません');
        }
        this.checkInterval = value;
    }

    getMaxNewVideos(): number {
        return this.maxNewVideos;
    }

    private setMaxNewVideos(value: number) {
        if (isNaN(value) || value < 0) {
            throw new Error('新着動画の表示数が正の整数ではありません');
        }
        this.maxNewVideos = value;
    }

    isCheckedListHidden(): boolean {
        return this.hideCheckedList;
    }

    private setCheckedListHidden(value: boolean): void {
        this.hideCheckedList = value;
    }

    isOrderDescendant(): boolean {
        return this.orderDescendant;
    }

    private setOrderDescendant(value: boolean): void {
        this.orderDescendant = value;
    }

}
