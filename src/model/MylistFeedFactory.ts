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

interface IMylistFeedFactory {
    getFeedFromServer(mylistId: MylistId, callback: (error: MylistFeedFetchError, feed: IMylistFeed) => any): util.IUrlFetchAborter;
}

class MylistFeedFactory {

    constructor(private fetcher: util.IUrlFetcher) {}

    getFeedFromServer(mylistId: MylistId, callback: (error: MylistFeedFetchError, feed: IMylistFeed) => any): util.IUrlFetchAborter {
        var options: util.IUrlFetchOption = {
            method:  'GET',
            url:     Nicovideo.getMylistSimpleFeedURL(mylistId)
        };
        return this.fetcher.fetch(options, (error: Error, response: util.IUrlFetchResponse) => {
            if (error) {
                callback(new MylistFeedFetchError(error.message || <any>error), null);
                return;
            }

            if (response.status === 200) {
                callback(null, new MylistFeed(response.responseText));
            } else {
                callback(new MylistFeedFetchError('Failed to fetch URL: ' + response.statusText, response.status), null);
            }
        });
    }

}
