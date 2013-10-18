/// <reference path="./mylist_feed.ts" />

interface MylistFeedRepository {

    resolve(mylistId: MylistFeedId): monapt.Future<monapt.Option<MylistFeed>>;

}
