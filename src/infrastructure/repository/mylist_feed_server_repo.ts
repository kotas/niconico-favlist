/// <reference path="../../domain/model/mylist/mylist_feed_repo.ts" />
/// <reference path="../util/url_fetcher.ts" />

class MylistFeedServerRepository implements MylistFeedRepository {

    NICOVIDEO_URL = 'http://';

    constructor(private fetcher: util.UrlFetcher) {
    }

    resolve(mylistId: MylistFeedId): monapt.Future<monapt.Option<MylistFeed>> {
        return monapt.Future<monapt.Option<MylistFeed>>(promise => {
            fetcher.fetch({ url:  })


        })
    }

}
