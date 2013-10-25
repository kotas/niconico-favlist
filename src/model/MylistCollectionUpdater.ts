/// <reference path="./UpdateInterval.ts" />
/// <reference path="./MylistFeedFactory.ts" />
/// <reference path="./MylistCollection.ts" />
/// <reference path="../util/Event.ts" />

interface IMylistCollectionUpdater {
    onStartUpdatingAll: util.IEvent<void>;
    onFinishUpdatingAll: util.IEvent<void>;
    onAbortUpdatingAll: util.IEvent<void>;
    onStartUpdatingMylist: util.IEvent<{mylist: Mylist}>;
    onFinishUpdatingMylist: util.Event<{mylist: Mylist}>;
    onFailedUpdatingMylist: util.Event<{mylist: Mylist; error: Error; httpStatus?: number}>;
    updateAll(collection: MylistCollection, callback?: () => void): util.IUrlFetchAborter;
}

class MylistCollectionUpdater implements IMylistCollectionUpdater {

    onStartUpdatingAll = new util.Event<void>();
    onFinishUpdatingAll = new util.Event<void>();
    onAbortUpdatingAll = new util.Event<void>();
    onStartUpdatingMylist = new util.Event<{mylist: Mylist}>();
    onFinishUpdatingMylist = new util.Event<{mylist: Mylist}>();
    onFailedUpdatingMylist = new util.Event<{mylist: Mylist; error: Error; httpStatus?: number}>();

    constructor(private mylistFeedFactory: IMylistFeedFactory) {}

    updateAll(collection: MylistCollection, callback?: () => void): util.IUrlFetchAborter {
        var mylists = Array.prototype.slice.call(collection.getMylists());
        if (mylists.length === 0) {
            callback && setTimeout(callback, 0);
            return null;
        }

        var aborted = false;
        var currentAborter: util.IUrlFetchAborter;
        var aborter: util.IUrlFetchAborter = {
            abort: () => {
                if (currentAborter) {
                    currentAborter.abort();
                }
                if (!aborted) {
                    aborted = true;
                    this.onAbortUpdatingAll.trigger(null);
                    callback && setTimeout(callback, 0);
                }
            }
        };

        this.onStartUpdatingAll.trigger(null);

        var updateNext = () => {
            if (aborted) {
                return;
            }

            var mylist: Mylist = mylists.shift();
            if (!mylist) {
                currentAborter = null;
                this.onFinishUpdatingAll.trigger(null);
                callback && setTimeout(callback, 0);
                return;
            }
            currentAborter = this.updateMylist(mylist, updateNext);
        };

        updateNext();
        return aborter;
    }

    private updateMylist(mylist: Mylist, callback?: (error: MylistFeedFetchError, mylist: Mylist) => any): util.IUrlFetchAborter {
        this.onStartUpdatingMylist.trigger({ mylist: mylist });
        return this.mylistFeedFactory.getFeedFromServer(
            mylist.getMylistId(),
            (error: MylistFeedFetchError, feed: IMylistFeed) => {
                if (error) {
                    this.onFailedUpdatingMylist.trigger({ mylist: mylist, error: error, httpStatus: error.httpStatus });
                } else {
                    mylist.setOriginalTitle(feed.getTitle());
                    mylist.updateVideos(feed.getVideos());
                    this.onFinishUpdatingMylist.trigger({ mylist: mylist });
                }
                callback && callback(error, mylist);
            }
        );
    }

}
