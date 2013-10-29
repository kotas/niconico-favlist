/// <reference path="./MylistId.ts" />

module Nicovideo {

    export var BASE_URL = 'http://www.nicovideo.jp/';

    export function getMylistURL(mylistId: MylistId): string {
        return BASE_URL + mylistId.toPath();
    }

    export function getMylistFeedURL(mylistId: MylistId): string {
        return getMylistURL(mylistId) + '?rss=2.0';
    }

    export function getMylistSimpleFeedURL(mylistId: MylistId): string {
        return getMylistURL(mylistId) + '?rss=atom&nodescription=1&noinfo=1';
    }

}
