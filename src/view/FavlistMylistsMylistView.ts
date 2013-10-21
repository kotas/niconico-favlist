/// <reference path="./View.ts" />
/// <reference path="../model/Mylist.ts" />
/// <reference path="./FavlistMylistsVideoView.ts" />

/**
 * events:
 *   - mylistClearRequest(mylist: Mylist)
 *   - mylistVideoWatch(mylist: Mylist, video: Video)
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
        this.$el.addClass('hasStatus');
        if (dismiss) {
            this.dismissStatusTimer = setTimeout(() => {
                this.dismissStatusTimer = null;
                this.hideStatus();
            }, 3000);
        }
    }

    hideStatus() {
        this.$el.removeClass('hasStatus');
        this.$el.find('.favlistMylistStatus span').hide();
    }

    update() {
        this.$el.find('.favlistMylistLink').attr('href', this.mylist.getURL());
        this.updateTitle();
        this.updateVideos();
    }

    private updateTitle() {
        this.$el.find('.favlistMylistTitle').text(this.mylist.getDisplayTitle() || this.mylist.getTitle() || "(無題)");
    }

    private updateVideos() {
        var count = this.mylist.getNewCount();
        this.$el.toggleClass('hasNewVideo', count > 0);
        this.$el.find('.favlistMylistNewCount').text(count.toString());
        this.$el.find('.favlistMylistClearButton').attr('disabled', count === 0).toggleClass('disabled', count === 0);

        this.videoViews = [];
        this.$videos.empty();
        this.mylist.getNewVideos().forEach((video: Video) => {
            var videoView = new FavlistMylistsVideoView(this.$videos, video);
            this.setEventHandlersForVideoView(videoView);
            videoView.show();
            this.videoViews.push(videoView);
        });
    }

    private setEventHandlers() {
        this.$el.find('.favlistMylistClearButton').click(() => {
            this.emitEvent('mylistClearRequest', [this.mylist]);
            return false;
        });

        this.mylist.addListener('updateTitle', () => {
            this.updateTitle();
        });
        this.mylist.addListener('updateDisplayTitle', () => {
            this.updateTitle();
        });
        this.mylist.addListener('updateVideos', () => {
            this.updateVideos();
        });
    }

    private setEventHandlersForVideoView(videoView: FavlistMylistsVideoView) {
        videoView.addListener('videoWatch', (video: Video) => {
            this.emitEvent('mylistVideoWatch', [this.mylist, video]);
        });
    }

}
