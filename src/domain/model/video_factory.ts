/// <reference path="./mylist_feed.ts" />
/// <reference path="./video.ts" />

class VideoFactory {

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

}
