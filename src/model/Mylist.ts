/// <reference path="./MylistId.ts" />
/// <reference path="./Video.ts" />
/// <reference path="./MylistFeed.ts" />
/// <reference path="./Nicovideo.ts" />
/// <reference path="../util/EventEmitter.ts" />

class Mylist extends util.EventEmitter {

    constructor(
        private mylistId: MylistId,
        private title: string = '',
        private displayTitle: string = '',
        private newVideos: Video[] = [],
        private checkedVideoIds: string[] = []
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

    getCheckedVideoIds(): string[] {
        return this.checkedVideoIds;
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
        if (this.displayTitle !== title) {
            this.displayTitle = title;
            this.emitEvent('updateDisplayTitle');
        }
    }

    updateVideos(videos: Video[]): void {
        var prevCheckedVideoIdMap: Object = {};
        this.checkedVideoIds.forEach((videoId: string) => {
            prevCheckedVideoIdMap[videoId] = true;
        });

        this.newVideos = [];
        this.checkedVideoIds = [];
        videos.forEach((video: Video) => {
            var videoId = video.getVideoId();
            if (prevCheckedVideoIdMap.hasOwnProperty(videoId)) {
                this.checkedVideoIds.push(videoId);
            } else {
                this.newVideos.push(video);
            }
        });

        this.emitEvent('updateVideos');
    }

}
