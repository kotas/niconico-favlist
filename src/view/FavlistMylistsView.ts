/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsMylistSubview.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />

/**
 * events:
 *   - checkNowRequest()
 *   - mylistClearRequest(mylist: Mylist)
 *   - mylistVideoWatch(mylist: Mylist, video: Video)
 */
class FavlistMylistsView extends View {

    private $mylists: JQuery;
    private mylistViews: { [mylistId: string]: FavlistMylistsMylistSubview } = {};

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {
        super(Template.load(Templates.favlist_mylists));
        this.$mylists = this.$el.find('.favlistMylists');
        this.setEventHandlers();
    }

    private setEventHandlers() {
        this.setEventHandlersForView();
        this.setEventHandlersForConfigService();
        this.setEventHandlersForMylistService();
    }

    private setEventHandlersForView() {
        this.$el.find('.favlistCheckNowButton').click(() => {
            this.emitEvent('checkNowRequest');
            return false;
        });
    }

    private setEventHandlersForConfigService() {
        this.configService.addListener('update', () => {
            this.update();
        });
    }

    private setEventHandlersForMylistService() {
        this.mylistService.addListener('update', () => {
            this.update();
        });
        this.mylistService.addListener('updateMylist', (mylist: Mylist) => {
            var mylistView = this.mylistViews[mylist.getMylistId().toString()];
            if (mylistView) {
                mylistView.render(mylist, this.configService.getConfig());
            }
        });
        this.mylistService.addListener('startUpdateAll', () => {
            this.$el.find('.favlistCheckNowButton').attr('disabled', true).addClass('disabled');
        });
        this.mylistService.addListener('changeMylistStatus', (mylist: Mylist, status: MylistStatus) => {
            var mylistView = this.mylistViews[mylist.getMylistId().toString()];
            if (mylistView) {
                mylistView.renderStatus(status);
            }
        });
        this.mylistService.addListener('finishUpdateAll', () => {
            this.$el.find('.favlistCheckNowButton').removeAttr('disabled').removeClass('disabled');
        });
    }

    update() {
        var mylists = this.mylistService.getMylistCollection().getMylists();
        var config = this.configService.getConfig();

        this.$el.toggleClass('noMylist', mylists.length === 0);
        this.$el.toggleClass('checkedMylistHidden', config.isCheckedListHidden());

        this.mylistViews = {};
        this.$mylists.empty();
        mylists.forEach((mylist: Mylist) => {
            var mylistId = mylist.getMylistId().toString();
            var mylistView = new FavlistMylistsMylistSubview();
            this.setEventHandlersForMylistView(mylist, mylistView);
            mylistView.render(mylist, config);
            mylistView.appendTo(this.$mylists);
            this.mylistViews[mylistId] = mylistView;
        });
    }

    private setEventHandlersForMylistView(mylist: Mylist, mylistView: FavlistMylistsMylistSubview) {
        mylistView.addListener('mylistClearRequest', () => {
            this.emitEvent('mylistClearRequest', [mylist]);
        });
        mylistView.addListener('mylistVideoWatch', (video: Video) => {
            this.emitEvent('mylistVideoWatch', [mylist, video]);
        });
    }

}
