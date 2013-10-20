/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsView.ts" />
/// <reference path="./FavlistSettingsView.ts" />

/**
 * events:
 *   - settingPageRequest()
 * delegate events from:
 *   - FavlistMylistsView
 *   - FavlistMylistsMylistView
 *   - FavlistMylistsVideoView
 *   - FavlistSettingsView
 */
class FavlistView extends View {

    private $pages: JQuery;

    private mylistsView: FavlistMylistsView;
    private settingsView: FavlistSettingsView;

    constructor() {
        super(FavlistView.createContainer(), Template.load(Templates.favlist));
        this.$pages = this.$el.find('.favlistPages');
        this.setEventHandlers();
    }

    showMylistPage(mylistCollection: MylistCollection) {
        this.$pages.children().hide();
        this.getMylistCollectionView(mylistCollection).show();
        this.$el.removeClass('inSettingView');
    }

    showSettingPage(mylistCollection: MylistCollection, config: Config) {
        this.$pages.children().hide();
        this.getSettingView(mylistCollection, config).show();
        this.$el.addClass('inSettingView');
    }

    getMylistCollectionView(mylistCollection: MylistCollection): FavlistMylistsView {
        if (this.mylistsView) {
            this.mylistsView.setMylistCollection(mylistCollection);
            return this.mylistsView;
        } else {
            this.mylistsView = new FavlistMylistsView(this.$pages, mylistCollection);
            this.mylistsView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
            return this.mylistsView;
        }
    }

    getSettingView(mylistCollection: MylistCollection, config: Config): FavlistSettingsView {
        if (this.settingsView) {
            this.settingsView.setMylistCollection(mylistCollection);
            this.settingsView.setConfig(config);
            return this.settingsView;
        } else {
            this.settingsView = new FavlistSettingsView(this.$pages, mylistCollection, config);
            this.settingsView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
            return this.settingsView;
        }
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
        var $outer = Template.load(Templates.rescue_container);
        var $container = $outer.find('#favlistRescueContainer');

        $outer.find('.favlistRescueCaption a').click(() => {
            $outer.toggleClass('closed');
            return false;
        });

        $outer.appendTo(window.document.body);
        return $container;
    }

}
