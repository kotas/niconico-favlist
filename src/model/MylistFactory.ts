/// <reference path="./Mylist.ts" />
/// <reference path="./MylistFeed.ts" />
/// <reference path="./Video.ts" />

class MylistFactory {

    createFromFeed(feed: MylistFeed): Mylist {
        return new Mylist(
            MylistId.fromURL(feed.getURL()),
            feed.getTitle(),
            null,
            feed.getEntries().map((entry: MylistFeedEntry): Video => {
                return new Video(
                    entry.getVideoId(),
                    entry.getTitle(),
                    entry.getURL(),
                    entry.getThumbnail(),
                    entry.getMemo(),
                    entry.getTimestamp()
                );
            })
        );
    }

}
