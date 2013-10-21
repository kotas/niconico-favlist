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

    constructor(
        private mylistCollection: MylistCollection,
        private config: IConfig
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

    getMylistCollectionView(): FavlistMylistsView {
        if (this.mylistsView) {
            return this.mylistsView;
        }
        this.mylistsView = new FavlistMylistsView(this.$pages, this.mylistCollection);
        this.mylistsView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
        return this.mylistsView;
    }

    getSettingView(): FavlistSettingsView {
        if (this.settingsView) {
            return this.settingsView;
        }

        this.settingsView = new FavlistSettingsView(this.$pages, this.mylistCollection, this.config);
        this.settingsView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
        return this.settingsView;
    }

    lock() {
        this.$el.find('.favlistCheckNowButton').attr('disabled', true).addClass('disabled');
    }

    unlock() {
        this.$el.find('.favlistCheckNowButton').removeAttr('disabled').removeClass('disabled');
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
