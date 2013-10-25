/// <reference path="../spec_helper.ts" />

describe('ConfigStorage', () => {

    var config = new Config(123, 45, true, false);

    var mockStorage: helper.IMockStorage;
    var configStorage: ConfigStorage;
    var otherConfigStorage: ConfigStorage;
    var onUpdateListener: SinonSpy;

    beforeEach(() => {
        mockStorage = helper.getMockStorage();
        configStorage = new ConfigStorage(mockStorage);
        otherConfigStorage = new ConfigStorage(mockStorage);

        onUpdateListener = sinon.spy();
        configStorage.onUpdate.addListener(onUpdateListener);
    });

    context('with no config in storage', () => {

        describe('#get', () => {
            it('returns default config', () => {
                var config = configStorage.get();
                var defaultConfig = new Config();
                expect(config).to.eql(defaultConfig);
            });
        });

        describe('#store', () => {
            it('stores config', () => {
                configStorage.store(config);

                var storedConfig = configStorage.get();
                expect(storedConfig).to.eql(config);
            });
        });

        describe('#checkUpdate', () => {
            it('does not trigger onUpdate', () => {
                configStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.false;
            });
        });

    });

    context('with config in storage', () => {

        var clock: SinonFakeTimers;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
            otherConfigStorage.store(config);
            clock.tick(5000);
        });
        afterEach(() => {
            clock.restore();
        });

        describe('#get', () => {
            it('returns stored config', () => {
                var storedConfig = configStorage.get();
                expect(storedConfig).to.eql(config);
            });
        });

        describe('#store', () => {
            it('overwrites stored config', () => {
                var newConfig = new Config();
                configStorage.store(newConfig);

                var storedConfig = configStorage.get();
                expect(storedConfig).to.eql(newConfig);
            });
        });

        describe('#checkUpdate', () => {
            it('triggers onUpdate before get', () => {
                configStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.true;
            });

            it('does not trigger onUpdate after get', () => {
                configStorage.get();
                configStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.false;
            });

            it('triggers onUpdate if updated after get', () => {
                configStorage.get();
                otherConfigStorage.store(config);
                configStorage.checkUpdate();
                expect(onUpdateListener.called).to.be.true;
            });
        });

    });

});
