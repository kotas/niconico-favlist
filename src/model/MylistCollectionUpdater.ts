/// <reference path="./UpdateInterval.ts" />
/// <reference path="./MylistFeedFactory.ts" />
/// <reference path="./MylistCollection.ts" />
/// <reference path="../util/EventEmitter.ts" />

interface IMylistCollectionUpdater extends util.IEventEmitter {
    updateAllIfExpired(collection: MylistCollection): util.IUrlFetchAborter;
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

    constructor(
        private updateInterval: IUpdateInterval,
        private mylistFeedFactory: IMylistFeedFactory
    ) {
        super();
    }

    updateAllIfExpired(collection: MylistCollection): util.IUrlFetchAborter {
        if (this.updateInterval.isExpired()) {
            return this.updateAll(collection);
        } else {
            return null;
        }
    }

    updateAll(collection: MylistCollection): util.IUrlFetchAborter {
        this.updateInterval.updateLastUpdateTime();

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
