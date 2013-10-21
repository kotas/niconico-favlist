/// <reference path="./UpdateInterval.ts" />
/// <reference path="./MylistFeedFactory.ts" />
/// <reference path="./MylistCollection.ts" />
/// <reference path="../util/EventEmitter.ts" />

/**
 * events:
 *   - startUpdateAll()
 *   - startUpdateMylist(mylist: Mylist)
 *   - failedUpdateMylist(mylist: Mylist, error: MylistFeedFetchError)
 *   - finishUpdateMylist(mylist: Mylist)
 *   - finishUpdateAll()
 */
class MylistCollectionUpdater extends util.EventEmitter {

    constructor(
        private updateInterval: IUpdateInterval,
        private mylistFeedFactory: IMylistFeedFactory,
        private mylistCollection: MylistCollection
    ) {
        super();
    }

    updateAllIfExpired(): util.IUrlFetchAborter {
        if (this.updateInterval.isExpired()) {
            return this.updateAll();
        } else {
            return null;
        }
    }

    updateAll(callback?: (error: Error) => any): util.IUrlFetchAborter {
        this.updateInterval.updateLastUpdateTime();

        var mylists = Array.prototype.slice.call(this.mylistCollection.getMylists());
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
                    callback && callback(new Error('Aborted'));
                }
            }
        };

        this.emitEvent('startUpdateAll');

        var updateNext = () => {
            var mylist: Mylist = mylists.shift();
            if (!mylist) {
                currentAborter = null;
                this.emitEvent('finishUpdateAll');
                callback && callback(null);
            }
            currentAborter = this.updateMylist(mylist, updateNext);
        };

        updateNext();
        return aborter;
    }

    updateMylist(mylist: Mylist, callback?: (error: MylistFeedFetchError, mylist: Mylist) => any): util.IUrlFetchAborter {
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
