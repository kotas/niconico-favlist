/// <reference path="./MylistId.ts" />
/// <reference path="./Video.ts" />
/// <reference path="./MylistFeed.ts" />
/// <reference path="./Nicovideo.ts" />

class Mylist {

    constructor(
        private mylistId: MylistId,
        private originalTitle: string = '',
        private overrideTitle: string = '',
        private newVideos: Video[] = [],
        private watchedVideoIds: string[] = []
    ) {
    }

    getMylistId(): MylistId {
        return this.mylistId;
    }

    getTitle(): string {
        return this.overrideTitle || this.originalTitle;
    }

    getOriginalTitle(): string {
        return this.originalTitle;
    }

    getOverrideTitle(): string {
        return this.overrideTitle;
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

    setOriginalTitle(title: string): void {
        this.originalTitle = title;
    }

    setOverrideTitle(title: string): void {
        if (title === this.overrideTitle) {
            title = '';
        }
        this.overrideTitle = title;
    }

    markVideoAsWatched(video: Video): void {
        var index = this.newVideos.indexOf(video);
        if (index >= 0) {
            this.newVideos.splice(index, 1);
            this.watchedVideoIds.push(video.getVideoId());
        }
    }

    markAllVideosAsWatched(): void {
        this.newVideos.forEach((video: Video) => {
            this.watchedVideoIds.push(video.getVideoId());
        });
        this.newVideos = [];
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
    }

}
