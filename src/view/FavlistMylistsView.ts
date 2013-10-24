/// <reference path="./View.ts" />
/// <reference path="./FavlistMylistsMylistSubview.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />

class FavlistMylistsView extends View {

    onUpdateAllMylistsRequest = new util.Event<void>();
    onClearMylistRequest = new util.Event<{ mylist: Mylist }>();
    onWatchMylistVideo = new util.Event<{ mylist: Mylist; video: Video }>();

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
            this.onUpdateAllMylistsRequest.trigger(null);
            return false;
        });
    }

    private setEventHandlersForConfigService() {
        this.configService.onUpdate.addListener(() => {
            if (this.isHidden()) return;
            this.update();
        });
    }

    private setEventHandlersForMylistService() {
        this.mylistService.onUpdate.addListener(() => {
            if (this.isHidden()) return;
            this.update();
        });
        this.mylistService.onUpdateMylist.addListener((args) => {
            if (this.isHidden()) return;
            var mylistView = this.mylistViews[args.mylist.getMylistId().toString()];
            if (mylistView) {
                mylistView.render(args.mylist, this.configService.getConfig());
            }
        });
        this.mylistService.onStartUpdatingAll.addListener(() => {
            this.$el.find('.favlistCheckNowButton').attr('disabled', true).addClass('disabled');
        });
        this.mylistService.onChangeMylistStatus.addListener((args) => {
            var mylistView = this.mylistViews[args.mylist.getMylistId().toString()];
            if (mylistView) {
                mylistView.renderStatus(args.status);
            }
        });
        this.mylistService.onFinishUpdatingAll.addListener(() => {
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
        mylistView.onClearMylistRequest.addListener(() => {
            this.onClearMylistRequest.trigger({ mylist: mylist });
        });
        mylistView.onWatchMylistVideo.addListener((args) => {
            this.onWatchMylistVideo.trigger({ mylist: mylist, video: args.video });
        });
    }

}
