/// <reference path="../view/FavlistMylistsView.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />

class FavlistMylistsController {

    private mylistsView: FavlistMylistsView;

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {}

    getView(): FavlistMylistsView {
        if (!this.mylistsView) {
            this.mylistsView = new FavlistMylistsView(this.configService, this.mylistService);
            this.setEventHandlersForView();
        }
        return this.mylistsView;
    }

    private setEventHandlersForView() {
        this.mylistsView.onShow.addListener(() => {
            this.mylistService.updateAllIfExpired();
        });
        this.mylistsView.onUpdateAllMylistsRequest.addListener(() => {
            this.mylistService.updateAll();
        });
        this.mylistsView.onClearMylistRequest.addListener((args) => {
            this.mylistService.markMylistAllWatched(args.mylist);
        });
        this.mylistsView.onWatchMylistVideo.addListener((args) => {
            this.mylistService.markVideoWatched(args.mylist, args.video);
        });
    }

}
