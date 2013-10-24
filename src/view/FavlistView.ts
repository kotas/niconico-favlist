/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsView.ts" />
/// <reference path="./FavlistSettingsView.ts" />

class FavlistView extends View {

    onSettingPageRequest = new util.Event<void>();

    private $pages: JQuery;
    private mylistsView: FavlistMylistsView;
    private settingsView: FavlistSettingsView;
    private views: View[] = [];

    constructor() {
        super(Template.load(Templates.favlist));
        this.$pages = this.$el.find('.favlistPages');
        this.setEventHandlers();
    }

    setMylistsView(view: FavlistMylistsView) {
        this.mylistsView = view;
        this.mylistsView.hide();
        this.mylistsView.appendTo(this.$pages);
        this.views.push(this.mylistsView);
    }

    setSettingsView(view: FavlistSettingsView) {
        this.settingsView = view;
        this.settingsView.hide();
        this.settingsView.appendTo(this.$pages);
        this.views.push(this.settingsView);
    }

    showMylistsPage() {
        if (!this.mylistsView) {
            throw new Error('MylistsView is not set');
        }
        this.switchView(this.mylistsView);
    }

    showSettingsPage() {
        if (!this.settingsView) {
            throw new Error('SettingsView is not set');
        }
        this.switchView(this.settingsView);
    }

    private switchView(view: View) {
        this.views.forEach((target: View) => {
            if (target !== view && target.isVisible()) {
                target.hide();
            }
        });
        view.show();
        this.$el.toggleClass('inSettingView', (view instanceof FavlistSettingsView));
    }

    private setEventHandlers() {
        this.$el.find('.favlistSettingButton').click(() => {
            this.onSettingPageRequest.trigger(null);
            return false;
        });
    }

}
