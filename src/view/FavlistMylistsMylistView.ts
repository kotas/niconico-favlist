/// <reference path="./View.ts" />
/// <reference path="../model/Mylist.ts" />
/// <reference path="./FavlistMylistsVideoView.ts" />

/**
 * events:
 *   - mylistClearRequest(mylist: Mylist)
 * delegate events from:
 *   - FavlistMylistsVideoView
 */
class FavlistMylistsMylistView extends View {

    private $videos: JQuery;
    private videoViews: FavlistMylistsVideoView[] = [];
    private dismissStatusTimer: number;

    constructor(
        $parent: JQuery,
        private mylist: Mylist
    ) {
        super($parent, Template.load(Templates.mylist));
        this.$videos = this.$el.find('.favlistMylistVideos');

        this.update();
        this.setEventHandlers();
    }

    showStatus(status: string, dismiss: boolean = false) {
        if (this.dismissStatusTimer) {
            clearTimeout(this.dismissStatusTimer);
            this.dismissStatusTimer = null;
        }
        this.$el.find('.favlistMylistStatus span').hide();
        this.$el.find('.favlistMylistStatus span.' + status).show();
        if (dismiss) {
            this.dismissStatusTimer = setTimeout(() => {
                this.dismissStatusTimer = null;
                this.$el.find('.favlistMylistStatus span.' + status).hide();
            }, 3000);
        }
    }

    update() {
        this.$el.toggleClass('hasNewVideo', this.mylist.getNewCount() > 0);
        this.$el.find('.favlistMylistTitle').text(this.mylist.getDisplayTitle());
        this.$el.find('.favlistMylistNewCount').text(this.mylist.getNewCount().toString());

        this.videoViews = [];
        this.$videos.empty();
        this.mylist.getNewVideos().forEach((video: Video) => {
            var videoView = new FavlistMylistsVideoView(this.$videos, video);
            videoView.addEventDelegator((eventName, args) => this.emitEvent(eventName, args));
            videoView.show();
            this.videoViews.push(videoView);
        });
    }

    private setEventHandlers() {
        this.$el.find('.favlistMylistClearButton').click(() => {
            this.emitEvent('mylistClearRequest', [this.mylist]);
            return false;
        });
    }

}
