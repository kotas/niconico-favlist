class Video {

    static createFromFeedEntry(entry: MylistFeedEntry) {
        return new Video(
            entry.getVideoId(),
            entry.getTitle(),
            entry.getURL(),
            entry.getThumbnail(),
            entry.getMemo(),
            entry.getTimestamp()
        )
    }

    constructor(
        private videoId: string,
        private title: string,
        private url: string,
        private thumbnail: string,
        private memo: string,
        private timestamp: number
    ) {
    }

    getVideoId(): string {
        return this.videoId;
    }

    getTitle(): string {
        return this.title;
    }

    getURL(): string {
        return this.url;
    }

    getThumbnail(): string {
        return this.thumbnail;
    }

    getMemo(): string {
        return this.memo;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

}
