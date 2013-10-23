/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsView.ts" />
/// <reference path="./FavlistSettingsView.ts" />
/// <reference path="../model/Config.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />

interface IFavlistView extends IView {
    setMylistsView(view: FavlistMylistsView);
    setSettingsView(view: FavlistSettingsView);
    showMylistsPage();
    showSettingsPage();
}

/**
 * events:
 *   - settingPageRequest()
 */
class FavlistView extends View implements IFavlistView {

    private $pages: JQuery;
    private mylistsView: FavlistMylistsView;
    private settingsView: FavlistSettingsView;

    constructor() {
        super(Template.load(Templates.favlist));
        this.$pages = this.$el.find('.favlistPages');
        this.setEventHandlers();
    }

    setMylistsView(view: FavlistMylistsView) {
        this.mylistsView = view;
        this.mylistsView.appendTo(this.$pages);
    }

    setSettingsView(view: FavlistSettingsView) {
        this.settingsView = view;
        this.settingsView.appendTo(this.$pages);
    }

    showMylistsPage() {
        if (!this.mylistsView) {
            throw new Error('MylistsView is not set');
        }
        this.$pages.children().hide();
        this.mylistsView.show();
        this.$el.removeClass('inSettingView');
    }

    showSettingsPage() {
        if (!this.settingsView) {
            throw new Error('SettingsView is not set');
        }
        this.$pages.children().hide();
        this.settingsView.show();
        this.$el.addClass('inSettingView');
    }

    private setEventHandlers() {
        this.$el.find('.favlistSettingButton').click(() => {
            this.emitEvent('settingPageRequest');
            return false;
        });
    }

}
