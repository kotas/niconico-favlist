/// <reference path="../spec_helper.ts" />

describe('util.TypedStorage', () => {

    var storageStub: { get: SinonStub; set: SinonStub };
    var typedStorage: util.TypedStorage;
    beforeEach(() => {
        storageStub = { get: sinon.stub(), set: sinon.stub() };
        typedStorage = new util.TypedStorage(storageStub);
    });

    context('with not existing key without default value', () => {

        beforeEach(() => {
            storageStub.get.returns(undefined);
        });

        describe('#get', () => {
            it('returns undefined', () => {
                expect(typedStorage.get('none')).to.be.undefined;
            });
        });

        describe('#getString', () => {
            it('returns undefined', () => {
                expect(typedStorage.getString('none')).to.be.undefined;
            });
        });

        describe('#getInteger', () => {
            it('returns undefined', () => {
                expect(typedStorage.getInteger('none')).to.be.undefined;
            });
        });

        describe('#getBoolean', () => {
            it('returns undefined', () => {
                expect(typedStorage.getBoolean('none')).to.be.undefined;
            });
        });

    });

    context('with not existing key with default value', () => {

        beforeEach(() => {
            storageStub.get.returnsArg(1);
        });

        describe('#get', () => {
            it('returns the default value', () => {
                expect(typedStorage.get('none', 'test')).to.equal('test');
            });
        });

        describe('#getString', () => {
            it('returns the default value', () => {
                expect(typedStorage.getString('none', 'test')).to.equal('test');
            });
        });

        describe('#getInteger', () => {
            it('returns the default value', () => {
                expect(typedStorage.getInteger('none', 123)).to.equal(123);
            });
        });

        describe('#getBoolean', () => {
            it('returns the default value', () => {
                expect(typedStorage.getBoolean('none', true)).to.equal(true);
            });
        });

    });

    context('with key of null value', () => {

        beforeEach(() => {
            storageStub.get.returns(null);
        });

        describe('#get', () => {
            it('returns null', () => {
                expect(typedStorage.get('test')).to.be.null;
            });
        });

        describe('#getString', () => {
            it('returns an empty string', () => {
                expect(typedStorage.getString('test')).to.equal('');
            });
        });

        describe('#getInteger', () => {
            it('returns an default value', () => {
                expect(typedStorage.getInteger('test', 123)).to.equal(123);
            });
        });

        describe('#getBoolean', () => {
            it('returns an default value', () => {
                expect(typedStorage.getBoolean('test', true)).to.equal(true);
            });
        });

    });

    context('with key of string value', () => {

        beforeEach(() => {
            storageStub.get.returns('hello');
        });

        describe('#get', () => {
            it('returns the string value', () => {
                expect(typedStorage.get('test')).to.equal('hello');
            });
        });

        describe('#getString', () => {
            it('returns the string value as-is', () => {
                expect(typedStorage.getString('test')).to.equal('hello');
            });
        });

        describe('#getInteger', () => {
            it('returns the default value for NaN', () => {
                expect(typedStorage.getInteger('test', 123)).to.equal(123);
            });

            it('returns the value as a number', () => {
                storageStub.get.returns('456');
                expect(typedStorage.getInteger('test', 123)).to.equal(456);
            });
        });

        describe('#getBoolean', () => {
            it('returns true for non-zero string', () => {
                expect(typedStorage.getBoolean('test')).to.equal(true);
            });

            it('returns false for a string "0"', () => {
                storageStub.get.returns('0');
                expect(typedStorage.getBoolean('test')).to.equal(false);
            });
        });

    });

    context('with key of number value', () => {

        beforeEach(() => {
            storageStub.get.returns(123);
        });

        describe('#get', () => {
            it('returns the number value as-is', () => {
                expect(typedStorage.get('test')).to.equal(123);
            });
        });

        describe('#getString', () => {
            it('returns the number value as string', () => {
                expect(typedStorage.getString('test')).to.equal('123');
            });
        });

        describe('#getInteger', () => {
            it('returns the number value as-is', () => {
                expect(typedStorage.getInteger('test')).to.equal(123);
            });
        });

        describe('#getBoolean', () => {
            it('returns true for non-zero', () => {
                expect(typedStorage.getBoolean('test')).to.equal(true);
            });

            it('returns false for zero', () => {
                storageStub.get.returns(0);
                expect(typedStorage.getBoolean('test')).to.equal(false);
            });
        });

    });

    context('with key of boolean value', () => {

        beforeEach(() => {
            storageStub.get.returns(123);
        });

        describe('#get', () => {
            it('returns the number value as-is', () => {
                expect(typedStorage.get('test')).to.equal(123);
            });
        });

        describe('#getString', () => {
            it('returns the number value as string', () => {
                expect(typedStorage.getString('test')).to.equal('123');
            });
        });

        describe('#getInteger', () => {
            it('returns the number value as-is', () => {
                expect(typedStorage.getInteger('test')).to.equal(123);
            });
        });

        describe('#getBoolean', () => {
            it('returns true for non-zero', () => {
                expect(typedStorage.getBoolean('test')).to.equal(true);
            });

            it('returns false for zero', () => {
                storageStub.get.returns(0);
                expect(typedStorage.getBoolean('test')).to.equal(false);
            });
        });

    });

    context('when setting null value', () => {

        describe('#set', () => {
            it('stores null', () => {
                typedStorage.set('test', null);
                expect(storageStub.set.calledWith('test', null)).to.be.true;
            });
        });

        describe('#setString', () => {
            it('stores an empty string', () => {
                typedStorage.setString('test', null);
                expect(storageStub.set.calledWith('test', '')).to.be.true;
            });
        });

        describe('#setInteger', () => {
            it('stores "0"', () => {
                typedStorage.setInteger('test', null);
                expect(storageStub.set.calledWith('test', '0')).to.be.true;
            });
        });

    });

    context('when setting string value', () => {

        describe('#set', () => {
            it('stores the string as-is', () => {
                typedStorage.set('test', 'hello');
                expect(storageStub.set.calledWith('test', 'hello')).to.be.true;
            });
        });

        describe('#setString', () => {
            it('stores the string as-is', () => {
                typedStorage.setString('test', 'hello');
                expect(storageStub.set.calledWith('test', 'hello')).to.be.true;
            });
        });

    });

    context('when setting number value', () => {

        describe('#set', () => {
            it('stores the number as-is', () => {
                typedStorage.set('test', 123);
                expect(storageStub.set.calledWith('test', 123)).to.be.true;
            });
        });

        describe('#setInteger', () => {
            it('stores the number as a string', () => {
                typedStorage.setInteger('test', 123);
                expect(storageStub.set.calledWith('test', '123')).to.be.true;
            });
        });

    });

    context('when setting boolean value', () => {

        describe('#set', () => {
            it('stores the boolean value as-is', () => {
                typedStorage.set('test', true);
                expect(storageStub.set.calledWith('test', true)).to.be.true;
            });
        });

        describe('#setBoolean', () => {
            it('stores "1" for true', () => {
                typedStorage.setBoolean('test', true);
                expect(storageStub.set.calledWith('test', '1')).to.be.true;
            });

            it('stores "0" for false', () => {
                typedStorage.setBoolean('test', false);
                expect(storageStub.set.calledWith('test', '0')).to.be.true;
            });
        });

    });

});


describe('util.UpdateTimeStorage', () => {

    var now = Date.now();
    var past = now - 60;
    var clock: SinonFakeTimers;

    var key = 'updateTime';
    var storageStub: { get: SinonStub; set: (key: string, value: any) => void };
    var utStorage: util.UpdateTimeStorage;
    var anotherUtStorage: util.UpdateTimeStorage;

    beforeEach(() => {
        clock = sinon.useFakeTimers(now);
        storageStub = {
            get: sinon.stub(),
            set: (key, value) => { storageStub.get.withArgs(key).returns(value); }
        };
        utStorage = new util.UpdateTimeStorage(storageStub, key);
        anotherUtStorage = new util.UpdateTimeStorage(storageStub, key);
    });
    afterEach(() => {
        clock.restore();
    });

    var expectNotChanged = () => { expect(utStorage.isChanged()).to.be.false };
    var expectChanged    = () => { expect(utStorage.isChanged()).to.be.true };

    context('with no update time in storage', () => {

        beforeEach(() => {
            storageStub.get.withArgs('updateTime').returns(undefined);
        });

        context('at first', () => {
            it('is not changed', expectNotChanged);
        });

        context('when fetched', () => {
            beforeEach(() => {
                utStorage.fetch();
            });
            it('stays not changed', expectNotChanged);
        });

        context('when updated by self before fetch', () => {
            beforeEach(() => {
                utStorage.update();
            });
            it('stays not changed', expectNotChanged);
        });

        context('when updated by self after fetch', () => {
            beforeEach(() => {
                utStorage.fetch();
                utStorage.update();
            });
            it('stays not changed', expectNotChanged);
        });

        context('when updated by other before fetch', () => {
            beforeEach(() => {
                anotherUtStorage.update();
            });
            it('turns changed', expectChanged);
        });

        context('when updated by other after fetch', () => {
            beforeEach(() => {
                utStorage.fetch();
                anotherUtStorage.update();
            });
            it('turns changed', expectChanged);
        });

    });

    context('with past update time in storage', () => {

        beforeEach(() => {
            storageStub.get.withArgs('updateTime').returns(past);
        });

        context('at first', () => {
            it('is already changed', expectChanged);
        });

        context('when fetched', () => {
            beforeEach(() => {
                utStorage.fetch();
            });
            it('turns not changed', expectNotChanged);
        });

        context('when updated by self before fetch', () => {
            beforeEach(() => {
                utStorage.update();
            });
            it('turns not changed', expectNotChanged);
        });

        context('when updated by self after fetch', () => {
            beforeEach(() => {
                utStorage.fetch();
                utStorage.update();
            });
            it('turns not changed', expectNotChanged);
        });

        context('when updated by other before fetch', () => {
            beforeEach(() => {
                anotherUtStorage.update();
            });
            it('stays changed', expectChanged);
        });

        context('when updated by other after fetch', () => {
            beforeEach(() => {
                utStorage.fetch();
                anotherUtStorage.update();
            });
            it('turns changed again', expectChanged);
        });

    });

});

