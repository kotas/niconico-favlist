/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsMylistView.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/MylistCollectionUpdater.ts" />
/// <reference path="../model/Config.ts" />

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
        $parent: JQuery,
        private config: IConfig,
        private mylistCollection: MylistCollection,
        private mylistCollectionUpdater: IMylistCollectionUpdater
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

    private updateMylistViews() {
        this.mylistViews = {};
        this.$mylists.empty();
        this.mylistCollection.getMylists().forEach((mylist: Mylist) => {
            var mylistView = new FavlistMylistsMylistView(this.$mylists, this.config, mylist);
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
        this.setEventHandlersForMylistCollectionUpdater();
    }

    private setEventHandlersForMylistCollectionUpdater() {
        var updateMylistViewStatus = (mylist: Mylist, status: string, dismiss: boolean = false): FavlistMylistsMylistView => {
            var mylistView = this.mylistViews[mylist.getMylistId().toString()];
            if (!mylistView) return null;
            if (status !== null) {
                mylistView.showStatus(status, dismiss);
            } else {
                mylistView.hideStatus();
            }
            return mylistView;
        };
        this.mylistCollectionUpdater.addListener('startUpdateAll', () => {
            this.$el.find('.favlistCheckNowButton').attr('disabled', true).addClass('disabled');
            this.mylistCollection.getMylists().forEach((mylist: Mylist) => {
                updateMylistViewStatus(mylist, 'waiting');
            });
        });
        this.mylistCollectionUpdater.addListener('startUpdateMylist', (mylist: Mylist) => {
            updateMylistViewStatus(mylist, 'updating');
        });
        this.mylistCollectionUpdater.addListener('failedUpdateMylist', (mylist: Mylist, error: MylistFeedFetchError) => {
            updateMylistViewStatus(mylist, 'failed', true);
        });
        this.mylistCollectionUpdater.addListener('finishUpdateMylist', (mylist: Mylist) => {
            updateMylistViewStatus(mylist, null);
        });
        this.mylistCollectionUpdater.addListener('finishUpdateAll', () => {
            this.$el.find('.favlistCheckNowButton').removeAttr('disabled').removeClass('disabled');
        });
    }

}
