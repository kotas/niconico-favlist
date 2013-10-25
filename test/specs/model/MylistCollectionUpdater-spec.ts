/// <reference path="../../spec_helper.ts" />

describe('MylistCollectionUpdater', () => {

    var feedFactoryStub: IMylistFeedFactory;
    var feedFetchError:  MylistFeedFetchError;
    var updater: MylistCollectionUpdater;

    var updateAborter: SinonSpy;
    var onStartUpdatingAllListener: SinonSpy;
    var onFinishUpdatingAllListener: SinonSpy;
    var onAbortUpdatingAllListener: SinonSpy;
    var onStartUpdatingMylistListener: SinonSpy;
    var onFinishUpdatingMylistListener: SinonSpy;
    var onFailedUpdatingMylistListener: SinonSpy;

    var mylist1: Mylist;
    var mylist2: Mylist;
    var video: Video = new Video('sm1', 'video title 1', 'http://example.com/sm1', 'http://example.com/t/sm1', '', Date.now());
    var feed1: IMylistFeed = { getTitle: () => "test feed1", getVideos: () => [video] };
    var feed2: IMylistFeed = { getTitle: () => "test feed2", getVideos: () => [] };

    beforeEach(() => {
        mylist1 = new Mylist(new MylistId(MylistIdType.Mylist, '1234'));
        mylist2 = new Mylist(new MylistId(MylistIdType.Mylist, '5678'));

        feedFetchError = null;
        updateAborter = sinon.spy();
        feedFactoryStub = {
            getFeedFromServer: (mylistId: MylistId, callback: (error: MylistFeedFetchError, feed: IMylistFeed) => any): util.IUrlFetchAborter => {
                setTimeout(() => {
                    if (updateAborter.called) {
                        callback(new MylistFeedFetchError('Aborted'), null);
                        return;
                    }
                    if (feedFetchError) {
                        callback(feedFetchError, null);
                    } else if (mylist1.getMylistId().equalTo(mylistId)) {
                        callback(null, feed1);
                    } else if (mylist2.getMylistId().equalTo(mylistId)) {
                        callback(null, feed2);
                    } else {
                        callback(new MylistFeedFetchError('No appropriate feed'), null);
                    }
                }, 0);
                return { abort: updateAborter };
            }
        };
        updater = new MylistCollectionUpdater(feedFactoryStub);

        updater.onStartUpdatingAll.addListener(onStartUpdatingAllListener = sinon.spy());
        updater.onFinishUpdatingAll.addListener(onFinishUpdatingAllListener = sinon.spy());
        updater.onAbortUpdatingAll.addListener(onAbortUpdatingAllListener = sinon.spy());
        updater.onStartUpdatingMylist.addListener(onStartUpdatingMylistListener = sinon.spy());
        updater.onFinishUpdatingMylist.addListener(onFinishUpdatingMylistListener = sinon.spy());
        updater.onFailedUpdatingMylist.addListener(onFailedUpdatingMylistListener = sinon.spy());
    });

    context('with no mylist', () => {

        beforeEach((done) => {
            updater.updateAll(new MylistCollection([]), done);
        });

        it('does not trigger onStartUpdatingAll', () => {
            expect(onStartUpdatingAllListener.called).to.be.false;
        });

        it('does not trigger onFinishUpdatingAll', () => {
            expect(onFinishUpdatingAllListener.called).to.be.false;
        });

        it('does not trigger onAbortUpdatingAll', () => {
            expect(onAbortUpdatingAllListener.called).to.be.false;
        });

        it('does not trigger onStartUpdatingMylist', () => {
            expect(onStartUpdatingMylistListener.called).to.be.false;
        });

        it('does not trigger onFinishUpdatingMylist', () => {
            expect(onFinishUpdatingMylistListener.called).to.be.false;
        });

        it('does not trigger onFailedUpdatingMylist', () => {
            expect(onFailedUpdatingMylistListener.called).to.be.false;
        });

    });

    context('with two mylists', () => {

        beforeEach((done) => {
            updater.updateAll(new MylistCollection([mylist1, mylist2]), done);
        });

        it('updates each mylist original title', () => {
            expect(mylist1.getOriginalTitle()).to.equal(feed1.getTitle());
            expect(mylist2.getOriginalTitle()).to.equal(feed2.getTitle());
        });

        it('updates each mylist videos', () => {
            expect(mylist1.getNewVideos()).to.eql([video]);
            expect(mylist2.getNewVideos()).to.be.empty;
        });

        it('triggers onStartUpdatingAll once', () => {
            expect(onStartUpdatingAllListener.calledOnce).to.be.true;
        });

        it('triggers onFinishUpdatingAll once', () => {
            expect(onFinishUpdatingAllListener.calledOnce).to.be.true;
        });

        it('does not trigger onAbortUpdatingAll', () => {
            expect(onAbortUpdatingAllListener.called).to.be.false;
        });

        it('triggers onStartUpdatingMylist twice', () => {
            expect(onStartUpdatingMylistListener.calledTwice).to.be.true;
        });

        it('gives each mylist to onStartUpdatingMylist listener', () => {
            expect(onStartUpdatingMylistListener.firstCall.calledWith({ mylist: mylist1 }));
            expect(onStartUpdatingMylistListener.secondCall.calledWith({ mylist: mylist2 }));
        });

        it('triggers onFinishUpdatingMylist twice', () => {
            expect(onFinishUpdatingMylistListener.calledTwice).to.be.true;
        });

        it('gives each mylist to onFinishUpdatingMylist listener', () => {
            expect(onFinishUpdatingMylistListener.firstCall.calledWith({ mylist: mylist1 }));
            expect(onFinishUpdatingMylistListener.secondCall.calledWith({ mylist: mylist2 }));
        });

        it('does not trigger onFailedUpdatingMylist', () => {
            expect(onFailedUpdatingMylistListener.called).to.be.false;
        });

    });

    context('when failed', () => {

        beforeEach((done) => {
            feedFetchError = new MylistFeedFetchError('Test Error', 500);
            updater.updateAll(new MylistCollection([mylist1, mylist2]), done);
        });

        it('triggers onFailedUpdatingMylist twice', () => {
            expect(onFailedUpdatingMylistListener.calledTwice).to.be.true;
        });

        it('gives each mylist to onFailedUpdatingMylist listener', () => {
            expect(onFailedUpdatingMylistListener.firstCall.calledWith({ mylist: mylist1 }));
            expect(onFailedUpdatingMylistListener.secondCall.calledWith({ mylist: mylist2 }));
        });

        it('does not trigger onFinishUpdatingMylist', () => {
            expect(onFinishUpdatingMylistListener.called).to.be.false;
        });

    });

    context('when aborted', () => {

        beforeEach((done) => {
            var aborter = updater.updateAll(new MylistCollection([mylist1, mylist2]), done);
            aborter.abort();
        });

        it('aborts fetching mylist', () => {
            expect(updateAborter.called).to.be.true;
        });

        it('triggers onStartUpdatingAll once', () => {
            expect(onStartUpdatingAllListener.calledOnce).to.be.true;
        });

        it('does not onFinishUpdatingAll', () => {
            expect(onFinishUpdatingAllListener.called).to.be.false;
        });

        it('triggers onAbortUpdatingAll once', () => {
            expect(onAbortUpdatingAllListener.calledOnce).to.be.true;
        });

        it('triggers onStartUpdatingMylist once', () => {
            expect(onStartUpdatingMylistListener.calledOnce).to.be.true;
        });

        it('does not trigger onFinishUpdatingMylist', () => {
            expect(onFinishUpdatingMylistListener.called).to.be.false;
        });

        it('triggers onFailedUpdatingMylist once', () => {
            expect(onFailedUpdatingMylistListener.calledOnce).to.be.true;
        });

        it('gives mylist and error to listener', () => {
            var args = onFailedUpdatingMylistListener.firstCall.args[0];
            expect(args.mylist).to.equal(mylist1);
            expect(args.error.message).to.equal('Aborted');
            expect(args.httpStatus).to.be.undefined;
        });

    });

});
