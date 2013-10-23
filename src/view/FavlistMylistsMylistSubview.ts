/// <reference path="./Subview.ts" />
/// <reference path="./FavlistMylistsVideoSubview.ts" />
/// <reference path="../service/MylistService.ts" />

/**
 * events:
 *   - mylistClearRequest()
 *   - mylistVideoWatch(video: Video)
 */
class FavlistMylistsMylistSubview extends Subview {

    private $videos: JQuery;
    private dismissStatusTimer: number;

    constructor() {
        super(Template.load(Templates.favlist_mylists_mylist));
        this.$videos = this.$el.find('.favlistMylistVideos');
        this.setEventHandlersForView();
    }

    private setEventHandlersForView() {
        this.$el.find('.favlistMylistClearButton').click(() => {
            this.emitEvent('mylistClearRequest');
            return false;
        });
    }

    render(mylist: Mylist, config: IConfig) {
        this.renderLink(mylist);
        this.renderTitle(mylist);
        this.renderVideos(mylist, config);
    }

    private renderLink(mylist: Mylist) {
        this.$el.find('.favlistMylistLink').attr('href', mylist.getURL());
    }

    private renderTitle(mylist: Mylist) {
        this.$el.find('.favlistMylistTitle').text(mylist.getTitle() || "(無題)").attr('title', mylist.getTitle());
    }

    private renderVideos(mylist: Mylist, config: IConfig) {
        var count = mylist.getNewCount();
        this.$el.toggleClass('hasNewVideo', count > 0);
        this.$el.find('.favlistMylistNewCount').text(count.toString());
        this.$el.find('.favlistMylistClearButton').attr('disabled', count === 0).toggleClass('disabled', count === 0);

        var videos = mylist.getNewVideos();
        var order = config.isOrderDescendant() ? 1 : -1;
        videos.sort((a: Video, b: Video) => {
            return (b.getTimestamp() - a.getTimestamp()) * order;
        });
        if (config.getMaxNewVideos() > 0) {
            videos = videos.slice(0, config.getMaxNewVideos());
        }

        this.$videos.empty();
        videos.forEach((video: Video) => {
            var videoView = new FavlistMylistsVideoSubview();
            this.setEventHandlersForVideoView(video, videoView);
            videoView.render(video);
            videoView.appendTo(this.$videos);
        });
    }

    private setEventHandlersForVideoView(video: Video, videoView: FavlistMylistsVideoSubview) {
        videoView.addListener('videoWatch', () => {
            this.emitEvent('mylistVideoWatch', [video]);
        });
    }

    renderStatus(status: MylistStatus) {
        switch (status) {
            case MylistStatus.Waiting:  this.showStatus('waiting'); break;
            case MylistStatus.Updating: this.showStatus('updating'); break;
            case MylistStatus.Private:  this.showStatus('private', true); break;
            case MylistStatus.Error:    this.showStatus('error', true); break;
            case MylistStatus.Finished: this.hideStatus(); break;
        }
    }

    private showStatus(status: string, dismiss: boolean = false) {
        this.$el.find('.favlistMylistStatus').find('span').hide().filter('.' + status).show();
        this.$el.addClass('hasStatus');

        if (this.dismissStatusTimer) {
            clearTimeout(this.dismissStatusTimer);
            this.dismissStatusTimer = null;
        }
        if (dismiss) {
            this.dismissStatusTimer = setTimeout(() => {
                this.dismissStatusTimer = null;
                this.hideStatus();
            }, 3000);
        }
    }

    private hideStatus() {
        this.$el.removeClass('hasStatus');
        this.$el.find('.favlistMylistStatus span').hide();
    }

}
