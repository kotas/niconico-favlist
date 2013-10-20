/// <reference path="./View.ts" />
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
        this.$el.find('.favlistVideoTimestamp').text(ViewHelper.formatTimestamp(this.video.getTimestamp()));
        this.$el.find('.favlistVideoTitle a').text(this.video.getTitle());
        if (this.video.getMemo()) {
            this.$el.find('.favlistVideoMemo').html(this.video.getMemo()).show();
        } else {
            this.$el.find('.favlistVideoMemo').hide();
        }
    }

    private setEventHandlers() {
        this.$el.find('.favlistVideoLink').click(() => {
            this.emitEvent('videoWatch', [this.video]);
        });
    }

}
