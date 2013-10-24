/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsView.ts" />
/// <reference path="./FavlistSettingsView.ts" />

class FavlistView extends View {

    onSettingPageRequest = new util.Event<void>();

    private mylistsView: FavlistMylistsView;
    private settingsView: FavlistSettingsView;

    constructor() {
        super(Template.load(Templates.favlist));
        this.setEventHandlers();
    }

    setMylistsView(view: FavlistMylistsView) {
        this.mylistsView = view;
        this.mylistsView.hide();
        this.mylistsView.appendTo(this.$el);
    }

    setSettingsView(view: FavlistSettingsView) {
        this.settingsView = view;
        this.settingsView.hide();
        this.settingsView.appendTo(this.$el);
    }

    showMylistsPage() {
        if (!this.mylistsView) {
            throw new Error('MylistsView is not set');
        }
        if (this.settingsView && this.settingsView.isVisible()) {
            this.settingsView.hide();
        }
        this.mylistsView.show();
    }

    showSettingsPage() {
        if (!this.settingsView) {
            throw new Error('SettingsView is not set');
        }
        this.settingsView.show();
    }

    private setEventHandlers() {
        this.$el.find('.favlistSettingButton').click(() => {
            this.onSettingPageRequest.trigger(null);
            return false;
        });
    }

}
