/// <reference path="../view/FavlistSettingsView.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />
/// <reference path="../util/Event.ts" />

class FavlistSettingsController {

    onFinish = new util.Event<void>();

    private settingsView: FavlistSettingsView;

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {}

    getView(): FavlistSettingsView {
        if (!this.settingsView) {
            this.settingsView = new FavlistSettingsView(this.configService, this.mylistService);
            this.setEventHandlersForView();
        }
        return this.settingsView;
    }

    private setEventHandlersForView() {
        this.settingsView.onSave.addListener((args) => {
            this.mylistService.setSettings(args.mylistSettings);
            this.configService.setSettings(args.configSettings);
            this.onFinish.trigger(null);
        });

        this.settingsView.onCancel.addListener(() => {
            this.onFinish.trigger(null);
        });
    }

}
