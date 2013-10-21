/// <reference path="./View.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/Config.ts" />
/// <reference path="./FavlistMylistsMylistView.ts" />

/**
 * events:
 *   - checkNowRequest(mylistCollection: MylistCollection)
 * delegate events from:
 *   - FavlistMylistsMylistView
 */
class FavlistMylistsView extends View {

    private $mylists: JQuery;
    private mylistViews: { [mylistId: string]: FavlistMylistsMylistView } = {};

    constructor(
        private config: IConfig,
        $parent: JQuery,
        private mylistCollection: MylistCollection
    ) {
        super($parent, Template.load(Templates.favlist_mylists));
        this.$mylists = this.$el.find('.favlistMylists');
        this.setEventHandlers();
    }

    update() {
        this.$el.toggleClass('noMylist', this.mylistCollection.isEmpty());
        this.$el.toggleClass('checkedMylistHidden', this.config.isCheckedListHidden());
        this.updateMylistViews();
    }

    getMylistView(mylistId: MylistId): FavlistMylistsMylistView {
        return this.mylistViews[mylistId.toString()] || null;
    }

    private updateMylistViews() {
        this.mylistViews = {};
        this.$mylists.empty();
        this.mylistCollection.getMylists().forEach((mylist: Mylist) => {
            var mylistView = new FavlistMylistsMylistView(this.config, this.$mylists, mylist);
            mylistView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
            mylistView.show();
            this.mylistViews[mylist.getMylistId().toString()] = mylistView;
        });
    }

    private setEventHandlers() {
        this.$el.find('.favlistCheckNowButton').click(() => {
            this.emitEvent('checkNowRequest', [this.mylistCollection]);
            return false;
        });
    }

}
