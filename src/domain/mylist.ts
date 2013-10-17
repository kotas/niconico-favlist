/// <reference path="./video.ts" />
/// <reference path="./mylist_feed.ts" />

class Mylist {

    constructor(
        private mylistId: string,
        private title: string = '',
        private checkedVideoIds: string[] = [],
        private newVideos: Video[] = []
    ) {
    }

    getMylistId(): string {
        return this.mylistId;
    }

    getTitle(): string {
        return this.title;
    }

    getCheckedVideoIds(): string[] {
        return this.checkedVideoIds;
    }

    getNewVideos(): Video[] {
        return this.newVideos;
    }

    getPath(): string {
        var matches = this.mylistId.match(/^myvideo\/(\d+)$/);
        if (matches) {
            return "/user/" + matches[1] + "/video";
        } else {
            return "/" + this.mylistId;
        }
    }

    updateWithFeed(feed: MylistFeed) {
        this.title = feed.getTitle() || this.title;

        var prevCheckedVideoIdMap: Object = {};
        this.checkedVideoIds.forEach((videoId: string) => {
            prevCheckedVideoIdMap[videoId] = true;
        });

        this.checkedVideoIds = [];
        this.newVideos = [];
        feed.getEntries().forEach((entry: MylistFeedEntry) => {
            var videoId = entry.getVideoId();
            if (prevCheckedVideoIdMap.hasOwnProperty(videoId)) {
                this.checkedVideoIds.push(videoId);
            } else {
                this.newVideos.push(Video.createFromFeedEntry(entry));
            }
        });
    }

}
