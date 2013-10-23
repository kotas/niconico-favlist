/// <reference path="../view/FavlistView.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />
/// <reference path="./FavlistMylistsController.ts" />
/// <reference path="./FavlistSettingsController.ts" />

interface IFavlistController {
    getView(): IFavlistView;
    start();
}

class FavlistController implements IFavlistController {

    private mylistsController: FavlistMylistsController;
    private settingsController: FavlistSettingsController;

    constructor(
        private favlistView: IFavlistView,
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {
        this.setEventHandlersForView();
    }

    private setEventHandlersForView() {
        this.favlistView.addListener('show', () => {
            this.showMylistsPage();
        });
        this.favlistView.addListener('settingPageRequest', () => {
            this.showSettingsPage();
        });
    }

    getView(): IFavlistView {
        return this.favlistView;
    }

    start() {
        this.favlistView.show();
        this.showMylistsPage();
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
            this.settingsController.addListener('finish', () => this.showMylistsPage());
            this.favlistView.setSettingsView(this.settingsController.getView());
        }
        this.favlistView.showSettingsPage();
    }

}
