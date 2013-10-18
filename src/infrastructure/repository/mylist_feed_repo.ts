/// <reference path="../../domain/model/mylist/remote_mylist_repo.ts" />
/// <reference path="../util/url_fetcher.ts" />
/// <reference path="../serialization/mylist_feed.ts" />

class MylistFeedRepository implements RemoteMylistRepository {

    static NICOVIDEO_URL = 'http://www.nicovideo.jp';

    constructor(private fetcher: util.UrlFetcher) {
    }

    resolve(mylistId: MylistId): monapt.Future<monapt.Option<Mylist>> {
        return monapt.Future<monapt.Option<MylistFeed>>((promise) => {
            var url = MylistFeedRepository.NICOVIDEO_URL + this.getFeedPath(mylistId);
            this.fetcher.fetch({ method: 'GET', url: url })
                .onSuccess((response: util.UrlFetchResponse) => {
                    if (response.status === 200) {
                        this.tryParseFeed(response.responseText).match({
                            Success: mylist => promise.success(new monapt.Some(mylist)),
                            Failure: e      => promise.failure(e)
                        });
                    } else if (response.status === 404 || response.status === 410) {
                        promise.success(new monapt.None<Mylist>());
                    } else {
                        promise.failure(new Error('Failed to fetch feed: ' + response.statusText));
                    }
                })
                .onFailure((e: Error) => {
                    promise.failure(e);
                });
        })
    }

    private tryParseFeed(xml: string): monapt.Try<Mylist> {
        return (new serialization.MylistFeedParser(xml)).toMylist();
    }

    private getFeedPath(mylistId: MylistId) {
        switch (mylistId.getIdType()) {
            case MylistIdType.User: return '/user/' + mylistId.getIdType() + '/video';
            default:                return '/' + mylistId.toString();
        }
    }

}
