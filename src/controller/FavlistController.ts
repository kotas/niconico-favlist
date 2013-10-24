/// <reference path="../view/FavlistView.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />
/// <reference path="./FavlistMylistsController.ts" />
/// <reference path="./FavlistSettingsController.ts" />

class FavlistController {

    private favlistView: FavlistView;
    private mylistsController: FavlistMylistsController;
    private settingsController: FavlistSettingsController;

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {}

    start() {
        this.getView().show();
        this.observeUpdate();
    }

    getView(): FavlistView {
        if (!this.favlistView) {
            this.favlistView = new FavlistView();
            this.setEventHandlersForView();
        }
        return this.favlistView;
    }

    private observeUpdate() {
        var updateInteval = 5000;
        var checkUpdate = () => {
            this.configService.checkUpdate();
            this.mylistService.checkUpdate();
            setTimeout(checkUpdate, updateInteval);
        };
        setTimeout(checkUpdate, updateInteval);
    }

    private setEventHandlersForView() {
        this.favlistView.onShow.addListener(() => {
            this.showMylistsPage();
        });
        this.favlistView.onSettingPageRequest.addListener(() => {
            this.showSettingsPage();
        });
    }

    private showMylistsPage() {
        if (!this.mylistsController) {
            this.mylistsController = new FavlistMylistsController(this.configService, this.mylistService);
            this.favlistView.setMylistsView(this.mylistsController.getView());
        }
        this.favlistView.showMylistsPage();
    }

    private showSettingsPage() {
        if (!this.settingsController) {
            this.settingsController = new FavlistSettingsController(this.configService, this.mylistService);
            this.settingsController.onFinish.addListener(() => this.showMylistsPage());
            this.favlistView.setSettingsView(this.settingsController.getView());
        }
        this.favlistView.showSettingsPage();
    }

}
