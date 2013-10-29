/// <reference path="../IFavlistDI.ts" />
/// <reference path="../view/FavlistSettingsView.ts" />
/// <reference path="../service/SettingsService.ts" />
/// <reference path="../util/Event.ts" />

class FavlistSettingsController {

    onFinish = new util.Event<void>();

    private settingsView: FavlistSettingsView;
    private settingsService: ISettingsService = DI.getSettingsService();

    getView(): FavlistSettingsView {
        if (!this.settingsView) {
            this.settingsView = new FavlistSettingsView(this.settingsService);
            this.setEventHandlersForView();
        }
        return this.settingsView;
    }

    private setEventHandlersForView() {
        this.settingsView.onSave.addListener((args: ISettings) => {
            try {
                this.settingsService.updateSettings(args);
            } catch (e) {
                this.settingsView.showError(e);
                return;
            }
            this.onFinish.trigger(null);
        });

        this.settingsView.onCancel.addListener(() => {
            this.onFinish.trigger(null);
        });

        this.settingsView.onImportRequest.addListener(() => {
            this.settingsView.showImportPage();
        });

        this.settingsView.onExportRequest.addListener(() => {
            this.settingsView.showExportPage(this.settingsService.exportString());
        });

        this.settingsView.onImportApply.addListener((args) => {
            try {
                this.settingsService.importString(args.importSetting);
            } catch (e) {
                this.settingsView.showError(e);
                return;
            }
            this.settingsView.returnToMainPage();
        });

        this.settingsView.onImportCancel.addListener(() => {
            this.settingsView.returnToMainPage();
        });

        this.settingsView.onExportClose.addListener(() => {
            this.settingsView.returnToMainPage();
        });

        this.settingsView.onOPMLExportRequest.addListener(() => {
            this.settingsView.exportOPML(this.settingsService.exportOPML());
        });
    }

}
