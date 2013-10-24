/// <reference path="./Subview.ts" />
/// <reference path="../model/Video.ts" />

class FavlistMylistsVideoSubview extends Subview {

    onWatchVideo = new util.Event<void>();

    constructor() {
        super(Template.load(Templates.favlist_mylists_video));
        this.setEventHandlers();
    }

    private setEventHandlers() {
        this.$el.find('.favlistVideoLink').click(() => {
            this.onWatchVideo.trigger(null);
        });
        this.$el.find('.favlistVideoMemo').click(() => {
            this.$el.find('.favlistVideoMemo').toggleClass('expanded');
            return false;
        });
    }

    render(video: Video) {
        this.$el.find('.favlistVideoLink').attr({
            href: video.getURL(),
            title: video.getTitle()
        });
        this.$el.find('.favlistVideoThumbnail img').attr('src', video.getThumbnail());
        this.$el.find('.favlistVideoTimestamp')
            .text(ViewHelper.formatTimestamp(video.getTimestamp()))
            .attr('title', new Date(video.getTimestamp()).toLocaleString());
        this.$el.find('.favlistVideoTitle').html(video.getTitle() || "(無題)");

        var memo = video.getMemo();
        if (memo) {
            this.$el.find('.favlistVideoMemoText').html(memo);
            this.$el.find('.favlistVideoMemo').show();
        } else {
            this.$el.find('.favlistVideoMemo').hide();
        }
    }

}
