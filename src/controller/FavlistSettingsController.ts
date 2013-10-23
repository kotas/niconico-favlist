/// <reference path="../view/FavlistSettingsView.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />
/// <reference path="../util/EventEmitter.ts" />

/**
 * events:
 *   - finish()
 */
class FavlistSettingsController extends util.EventEmitter {

    private settingsView: FavlistSettingsView;

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {
        super();
    }

    getView(): FavlistSettingsView {
        if (!this.settingsView) {
            this.settingsView = new FavlistSettingsView(this.configService, this.mylistService);
            this.setEventHandlersForView();
        }
        return this.settingsView;
    }

    private setEventHandlersForView() {
        this.settingsView.addListener('settingSave', (mylistSettings: IMylistSetting[], configSettings: IConfig) => {
            this.mylistService.setSettings(mylistSettings);
            this.configService.setSettings(configSettings);
            this.emitEvent('finish');
        });

        this.settingsView.addListener('settingCancel', () => {
            this.emitEvent('finish');
        });
    }

}
