/// <reference path="./MylistId.ts" />
/// <reference path="./Video.ts" />
/// <reference path="./MylistFeed.ts" />
/// <reference path="./Nicovideo.ts" />
/// <reference path="../util/EventEmitter.ts" />

/**
 * events:
 *   - updateTitle()
 *   - updateDisplayTitle()
 *   - updateVideos()
 */
class Mylist extends util.EventEmitter {

    constructor(
        private mylistId: MylistId,
        private title: string = '',
        private displayTitle: string = '',
        private newVideos: Video[] = [],
        private watchedVideoIds: string[] = []
    ) {
        super();
    }

    getMylistId(): MylistId {
        return this.mylistId;
    }

    getTitle(): string {
        return this.title;
    }

    getDisplayTitle(): string {
        return this.displayTitle;
    }

    getNewVideos(): Video[] {
        return this.newVideos;
    }

    getNewCount(): number {
        return this.newVideos.length;
    }

    getWatchedVideoIds(): string[] {
        return this.watchedVideoIds;
    }

    getURL(): string {
        return Nicovideo.getMylistURL(this.mylistId);
    }

    setTitle(title: string): void {
        if (this.title !== title) {
            this.title = title;
            this.emitEvent('updateTitle');
        }
    }

    setDisplayTitle(title: string): void {
        if (title === this.title) {
            title = '';
        }
        if (this.displayTitle !== title) {
            this.displayTitle = title;
            this.emitEvent('updateDisplayTitle');
        }
    }

    markVideoAsWatched(video: Video): void {
        var index = this.newVideos.indexOf(video);
        if (index >= 0) {
            this.newVideos.splice(index, 1);
            this.watchedVideoIds.push(video.getVideoId());
        }
        this.emitEvent('updateVideos');
    }

    markAllVideosAsWatched(): void {
        this.newVideos.forEach((video: Video) => {
            this.watchedVideoIds.push(video.getVideoId());
        });
        this.newVideos = [];
        this.emitEvent('updateVideos');
    }

    updateWithFeed(feed: MylistFeed): void {
        if (feed.getTitle()) {
            this.setTitle(feed.getTitle());
        }
        this.updateVideos(feed.getEntries().map((entry: MylistFeedEntry): Video => {
            return new Video(
                entry.getVideoId(),
                entry.getTitle(),
                entry.getURL(),
                entry.getThumbnail(),
                entry.getMemo(),
                entry.getTimestamp()
            );
        }));
    }

    updateVideos(videos: Video[]): void {
        var prevWatchedVideoIdMap: Object = {};
        this.watchedVideoIds.forEach((videoId: string) => {
            prevWatchedVideoIdMap[videoId] = true;
        });

        this.newVideos = [];
        this.watchedVideoIds = [];
        videos.forEach((video: Video) => {
            var videoId = video.getVideoId();
            if (prevWatchedVideoIdMap.hasOwnProperty(videoId)) {
                this.watchedVideoIds.push(videoId);
            } else {
                this.newVideos.push(video);
            }
        });

        this.emitEvent('updateVideos', [this]);
    }

}
