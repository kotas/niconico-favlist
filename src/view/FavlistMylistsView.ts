/// <reference path="./View.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="./FavlistMylistsMylistView.ts" />

/**
 * events:
 *   - checkNowRequest(mylistCollection: MylistCollection)
 * delegate events from:
 *   - FavlistMylistsMylistView
 *   - FavlistMylistsVideoView
 */
class FavlistMylistsView extends View {

    private $mylists: JQuery;
    private mylistViews: FavlistMylistsMylistView[] = [];

    constructor(
        $parent: JQuery,
        private mylistCollection: MylistCollection
    ) {
        super($parent, Template.load(Templates.favlist_mylists));
        this.$mylists = this.$el.find('.favlistMylists');
        this.update();
        this.setEventHandlers();
    }

    setMylistCollection(mylistCollection: MylistCollection) {
        if (this.mylistCollection !== mylistCollection) {
            this.mylistCollection = mylistCollection;
            this.updateMylistViews();
        }
    }

    update() {
        this.$el.toggleClass('noMylist', this.mylistCollection.isEmpty());
        this.updateMylistViews();
    }

    private updateMylistViews() {
        this.mylistViews = [];
        this.$mylists.empty();
        this.mylistCollection.getMylists().forEach((mylist: Mylist) => {
            var mylistView = new FavlistMylistsMylistView(this.$mylists, mylist);
            mylistView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
            mylistView.show();
            this.mylistViews.push(mylistView);
        });
    }

    private setEventHandlers() {
        this.$el.find('.favlistCheckNowButton').click(() => {
            this.emitEvent('checkNowRequest', [this.mylistCollection]);
            return false;
        });
    }

}
