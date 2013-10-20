/// <reference path="./Nicovideo.ts" />
/// <reference path="./MylistId.ts" />
/// <reference path="./MylistFeed.ts" />
/// <reference path="../util/UrlFetcher.ts" />

class MylistFeedFactory {

    constructor(private fetcher: util.IUrlFetcher) {}

    getFeedFromServer(mylistId: MylistId, callback: (error: Error, feed: MylistFeed) => any): util.IUrlFetchAborter {
        var feedURL = Nicovideo.getMylistFeedURL(mylistId);
        return this.fetcher.fetch({ method: 'GET', url: feedURL }, (error: Error, response: util.IUrlFetchResponse) => {
            if (error) {
                callback(error, null);
                return;
            }

            if (response.status === 200) {
                callback(null, new MylistFeed(feedURL, response.statusText));
            } else {
                callback(new Error('Failed to fetch URL: ' + response.statusText), null);
            }
        });
    }

}
