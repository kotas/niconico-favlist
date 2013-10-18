/// <reference path="./mylist_id.ts" />
/// <reference path="../video/video.ts" />
/// <reference path="../../base/entity.ts" />

class Mylist implements Entity<Mylist, MylistId> {

    constructor(
        private id: MylistId,
        private title: string = '',
        private newVideos: Video[] = [],
        private checkedVideoIds: string[] = []
    ) {
    }

    getId(): MylistId {
        return this.id;
    }

    isSameAs(entity: Mylist): boolean {
        return entity.getId().isSameAs(entity.getId());
    }

    getTitle(): string {
        return this.title;
    }

    getNewVideos(): Video[] {
        return this.newVideos;
    }

    getCheckedVideoIds(): string[] {
        return this.checkedVideoIds;
    }

    getPath(): string {
        switch (this.id.getIdType()) {
            case MylistIdType.User: return '/user/' + this.id.getIdValue() + '/video';
            default: return '/' + this.id.toString();
        }
    }

    /*
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
                this.newVideos.push(VideoFactory.createFromFeedEntry(entry));
            }
        });
    }
    */

}
