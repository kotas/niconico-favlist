/// <reference path="../view/FavlistMylistsView.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />

class FavlistMylistsController {

    private mylistsView: FavlistMylistsView;

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {
        this.mylistsView = new FavlistMylistsView(this.configService, this.mylistService);
        this.setEventHandlers();
    }

    getView(): FavlistMylistsView {
        return this.mylistsView;
    }

    private setEventHandlers() {
        this.mylistsView.addListener('show', () => {
            this.mylistService.updateAllIfExpired();
        });
        this.mylistsView.addListener('checkNowRequest', () => {
            this.mylistService.updateAll();
        });
        this.mylistsView.addListener('mylistClearRequest', (mylist: Mylist) => {
            this.mylistService.markMylistAllWatched(mylist);
        });
        this.mylistsView.addListener('mylistVideoWatch', (mylist: Mylist, video: Video) => {
            this.mylistService.markVideoWatched(mylist, video);
        });
    }

}
