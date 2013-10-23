/// <reference path="./UpdateInterval.ts" />
/// <reference path="./MylistFeedFactory.ts" />
/// <reference path="./MylistCollection.ts" />
/// <reference path="../util/EventEmitter.ts" />

interface IMylistCollectionUpdater extends util.IEventEmitter {
    updateAll(collection: MylistCollection): util.IUrlFetchAborter;
}

/**
 * events:
 *   - startUpdateAll()
 *   - startUpdateMylist(mylist: Mylist)
 *   - failedUpdateMylist(mylist: Mylist, error: MylistFeedFetchError)
 *   - finishUpdateMylist(mylist: Mylist)
 *   - abortUpdateAll()
 *   - finishUpdateAll()
 */
class MylistCollectionUpdater extends util.EventEmitter implements IMylistCollectionUpdater {

    constructor(private mylistFeedFactory: IMylistFeedFactory) {
        super();
    }

    updateAll(collection: MylistCollection): util.IUrlFetchAborter {
        var mylists = Array.prototype.slice.call(collection.getMylists());
        if (mylists.length === 0) {
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
                    this.emitEvent('abortUpdateAll');
                }
            }
        };

        this.emitEvent('startUpdateAll');

        var updateNext = () => {
            var mylist: Mylist = mylists.shift();
            if (!mylist) {
                currentAborter = null;
                this.emitEvent('finishUpdateAll');
                return;
            }
            if (aborted) {
                return;
            }
            currentAborter = this.updateMylist(mylist, updateNext);
        };

        updateNext();
        return aborter;
    }

    private updateMylist(mylist: Mylist, callback?: (error: MylistFeedFetchError, mylist: Mylist) => any): util.IUrlFetchAborter {
        this.emitEvent('startUpdateMylist', [mylist]);
        return this.mylistFeedFactory.getFeedFromServer(
            mylist.getMylistId(),
            (error: MylistFeedFetchError, feed: MylistFeed) => {
                if (error) {
                    this.emitEvent('failedUpdateMylist', [mylist, error]);
                } else {
                    mylist.updateWithFeed(feed);
                    this.emitEvent('finishUpdateMylist', [mylist]);
                }
                callback && callback(error, mylist);
            }
        );
    }

}
