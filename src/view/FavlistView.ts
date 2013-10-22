/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsView.ts" />
/// <reference path="./FavlistSettingsView.ts" />
/// <reference path="../model/Config.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />

/**
 * events:
 *   - settingPageRequest()
 * delegate events from:
 *   - FavlistMylistsView
 *   - FavlistMylistsMylistView
 *   - FavlistSettingsView
 */
class FavlistView extends View {

    private $pages: JQuery;

    private mylistsView: FavlistMylistsView;
    private settingsView: FavlistSettingsView;

    constructor(
        private config: IConfig,
        private mylistCollection: MylistCollection,
        private mylistCollectionUpdater: IMylistCollectionUpdater
    ) {
        super(FavlistView.createContainer(), Template.load(Templates.favlist));
        this.$pages = this.$el.find('.favlistPages');
        this.setEventHandlers();
    }

    showMylistPage() {
        this.$pages.children().hide();
        this.getMylistCollectionView().show();
        this.$el.removeClass('inSettingView');
    }

    showSettingPage() {
        this.$pages.children().hide();
        this.getSettingView().show();
        this.$el.addClass('inSettingView');
    }

    private getMylistCollectionView(): FavlistMylistsView {
        if (this.mylistsView) {
            return this.mylistsView;
        }
        this.mylistsView = new FavlistMylistsView(this.$pages, this.config, this.mylistCollection, this.mylistCollectionUpdater);
        this.mylistsView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
        return this.mylistsView;
    }

    private getSettingView(): FavlistSettingsView {
        if (this.settingsView) {
            return this.settingsView;
        }

        this.settingsView = new FavlistSettingsView(this.$pages, this.config, this.mylistCollection);
        this.settingsView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
        return this.settingsView;
    }

    private setEventHandlers() {
        this.$el.find('.favlistSettingButton').click(() => {
            this.emitEvent('settingPageRequest');
            return false;
        });
    }

    private static createContainer(): JQuery {
        var $parent: JQuery = $('#favlistRescueContainer, #sideContents, .column.sub').eq(0);
        if ($parent.length === 0) {
            $parent = FavlistView.createRescueContainer();
        }
        return $('<div />').prependTo($parent);
    }

    private static createRescueContainer(): JQuery {
        var $outer = Template.load(Templates.favlist_rescue);
        var $container = $outer.find('#favlistRescueContainer');

        $outer.find('.favlistRescueCaption a').click(() => {
            $outer.toggleClass('closed');
            return false;
        });

        $outer.appendTo(window.document.body);
        return $container;
    }

}
