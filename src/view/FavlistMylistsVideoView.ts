/// <reference path="./View.ts" />
/// <reference path="../model/Mylist.ts" />
/// <reference path="../model/Video.ts" />

/**
 * events:
 *   - videoWatch(video: Video)
 */
class FavlistMylistsVideoView extends View {

    constructor(
        $parent: JQuery,
        private video: Video
    ) {
        super($parent, Template.load(Templates.video));
        this.update();
        this.setEventHandlers();
    }

    update() {
        this.$el.find('.favlistVideoLink').attr({
            href: this.video.getURL(),
            title: this.video.getTitle()
        });
        this.$el.find('.favlistVideoThumbnail img').attr('src', this.video.getThumbnail());
        this.$el.find('.favlistVideoTimestamp')
            .text(ViewHelper.formatTimestamp(this.video.getTimestamp()))
            .attr('title', new Date(this.video.getTimestamp()).toLocaleString());
        this.$el.find('.favlistVideoTitle').html(this.video.getTitle() || "(無題)");

        var memo = this.video.getMemo();
        if (memo) {
            this.$el.find('.favlistVideoMemoText').html(memo);
            this.$el.find('.favlistVideoMemo').show();
        } else {
            this.$el.find('.favlistVideoMemo').hide();
        }
    }

    private setEventHandlers() {
        this.$el.find('.favlistVideoLink').click(() => {
            this.emitEvent('videoWatch', [this.video]);
        });
        this.$el.find('.favlistVideoMemo').click(() => {
            this.$el.find('.favlistVideoMemo').toggleClass('expanded');
            return false;
        });
    }

}
