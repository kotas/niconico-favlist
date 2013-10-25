/// <reference path="../spec_helper.ts" />

describe('MylistCollectionStorage', () => {

    var mockStorage: helper.IMockStorage;
    var mcStorage: MylistCollectionStorage;
    var otherMcStorage: MylistCollectionStorage;
    var onUpdateListener: SinonSpy;

    var mylist1: Mylist = new Mylist(new MylistId(MylistIdType.Mylist, '1234'));
    var mylist2: Mylist = new Mylist(new MylistId(MylistIdType.Mylist, '5678'));
    var collection: MylistCollection = new MylistCollection([mylist1, mylist2]);

    beforeEach(() => {
        mockStorage = helper.getMockStorage();
        mcStorage = new MylistCollectionStorage(mockStorage);
        otherMcStorage = new MylistCollectionStorage(mockStorage);

        onUpdateListener = sinon.spy();
        mcStorage.onUpdate.addListener(onUpdateListener);
    });

    context('with no collection in storage', () => {

        describe('#get', () => {
            it('returns empty colleciton', () => {
                var mc = mcStorage.get();
                expect(mc.isEmpty()).to.be.true;
            });
        });

        describe('#store', () => {
            it('stores collection', () => {
                var mc = new MylistCollection([]);
                mcStorage.store(collection);

                var stored = mcStorage.get();
                expect(stored).to.not.equal(collection);
                expect(stored).to.eql(collection);
            });
        });

        describe('#checkUpdate', () => {
            it('does not trigger onUpdate', () => {
                mcStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.false;
            });
        });

    });

    context('with collection in storage', () => {

        var clock: SinonFakeTimers;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
            otherMcStorage.store(collection);
            clock.tick(5000);
        });
        afterEach(() => {
            clock.restore();
        });

        describe('#get', () => {
            it('returns stored collection', () => {
                var stored = mcStorage.get();
                expect(stored).to.eql(collection);
            });
        });

        describe('#store', () => {
            it('overwrites stored collection', () => {
                var newCollection = new MylistCollection([mylist2]);
                mcStorage.store(newCollection);

                var stored = mcStorage.get();
                expect(stored).to.eql(newCollection);
            });
        });

        describe('#checkUpdate', () => {
            it('triggers onUpdate before get', () => {
                mcStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.true;
            });

            it('does not trigger onUpdate after get', () => {
                mcStorage.get();
                mcStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.false;
            });

            it('triggers onUpdate if updated after get', () => {
                mcStorage.get();
                otherMcStorage.store(collection);
                mcStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.true;
            });
        });

    });

});
