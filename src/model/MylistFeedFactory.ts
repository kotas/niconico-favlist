/// <reference path="./Nicovideo.ts" />
/// <reference path="./MylistId.ts" />
/// <reference path="./MylistFeed.ts" />
/// <reference path="../util/UrlFetcher.ts" />
/// <reference path="../util/CustomError.ts" />


class MylistFeedFetchError extends util.CustomError {
    constructor(message: string, public httpStatus?: number) {
        super('MylistFeedFetchError', message);
    }
}

class MylistFeedFactory {

    constructor(private fetcher: util.IUrlFetcher) {}

    getFeedFromServer(mylistId: MylistId, callback: (error: MylistFeedFetchError, feed: MylistFeed) => any): util.IUrlFetchAborter {
        var feedURL = Nicovideo.getMylistFeedURL(mylistId);
        return this.fetcher.fetch({ method: 'GET', url: feedURL }, (error: Error, response: util.IUrlFetchResponse) => {
            if (error) {
                callback(new MylistFeedFetchError(error.message || error), null);
                return;
            }

            if (response.status === 200) {
                callback(null, new MylistFeed(feedURL, response.responseText));
            } else {
                callback(new MylistFeedFetchError('Failed to fetch URL: ' + response.statusText, response.status), null);
            }
        });
    }

}
