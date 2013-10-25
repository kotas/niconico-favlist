/// <reference path="../spec_helper.ts" />

describe('MylistCollection', () => {

    var collection: MylistCollection;
    var mylist1: Mylist = new Mylist(new MylistId(MylistIdType.Mylist, '1234'));
    var mylist2: Mylist = new Mylist(new MylistId(MylistIdType.Mylist, '5678'));

    context('with no mylists', () => {

        beforeEach(() => {
            collection = new MylistCollection([]);
        });

        it('is empty', () => {
            expect(collection.isEmpty()).to.be.true;
        });

        it('contains no mylist', () => {
            expect(collection.getMylists()).to.be.empty;
        });

        context('when mylist is added', () => {
            beforeEach(() => {
                collection.add(mylist1);
            });

            it('becomes not empty', () => {
                expect(collection.isEmpty()).to.be.false;
            });

            it('contains the added mylist', () => {
                expect(collection.getMylists()).to.contain(mylist1);
            });
        });

    });

    context('with some mylists', () => {

        beforeEach(() => {
            collection = new MylistCollection([mylist1, mylist2]);
        });

        it('is not empty', () => {
            expect(collection.isEmpty()).to.be.false;
        });

        it('contains mylists', () => {
            expect(collection.getMylists()).to.contain(mylist1);
        });

        it('returns a mylist for mylist ID', () => {
            expect(collection.get(mylist1.getMylistId())).to.equal(mylist1);
        });

        it('returns null if mylist ID does not exist', () => {
            var mylistId = new MylistId(MylistIdType.Mylist, '999');
            expect(collection.get(mylistId)).to.be.null;
        });

        context('when mylist is removed', () => {
            beforeEach(() => {
                collection.remove(mylist1);
            });

            it('does not contain the mylist any more', () => {
                expect(collection.getMylists()).to.not.contain(mylist1);
            });

            it('is still not empty', () => {
                expect(collection.isEmpty()).to.be.false;
            });
        });

        context('when new mylists set', () => {
            var mylist3: Mylist = new Mylist(new MylistId(MylistIdType.Mylist, '9876'));

            beforeEach(() => {
                collection.setMylists([mylist1, mylist3]);
            });

            it('contains new mylists', () => {
                expect(collection.getMylists()).to.contain(mylist3);
            });

            it('does not contain a old mylist', () => {
                expect(collection.getMylists()).to.not.contain(mylist2);
            });
        });

    });

});
