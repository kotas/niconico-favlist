/// <reference path="../spec_helper.ts" />
/// <reference path="../../src/util/Event.ts" />

describe('util.Event', () => {

    var event: util.Event<any>;
    var listener: SinonSpy;
    beforeEach(() => {
        event = new util.Event<any>();
        listener = sinon.spy();
    });

    describe('#trigger', () => {

        context('when listener is added', () => {

            beforeEach(() => {
                event.addListener(listener);
            });

            it('notifies the listener', () => {
                event.trigger(null);
                expect(listener.called).to.be.true;
            });

            it('notifies the listener each time', () => {
                event.trigger(null);
                event.trigger(null);
                expect(listener.callCount).to.equal(2);
            });

            it('passes a parameter to the listener', () => {
                event.trigger(123);
                expect(listener.callArg(0)).to.equal(123);
            });

        });

        context('when many listeners are added', () => {

            var listener2: SinonSpy;
            var listener3: SinonSpy;

            beforeEach(() => {
                event.addListener(listener);
                event.addListener(listener2 = sinon.spy());
                event.addListener(listener3 = sinon.spy());
            });

            it('notifies all of them', () => {
                event.trigger(null);
                expect(listener.called).to.be.true;
                expect(listener2.called).to.be.true;
                expect(listener3.called).to.be.true;
            });

        });

        context('when once listener is added', () => {

            beforeEach(() => {
                event.addOnceListener(listener);
            });

            it('notifies the listener only once', () => {
                event.trigger(null);
                event.trigger(null);
                expect(listener.calledOnce).to.be.true;
            });

        });

        context('when listener is removed', () => {

            beforeEach(() => {
                event.addListener(listener);
                event.removeListener(listener);
            });

            it('never notifies the listener', () => {
                event.trigger(null);
                expect(listener.called).to.be.false;
            });

        });

        context('when listener is cleared', () => {

            beforeEach(() => {
                event.addListener(listener);
                event.clearListeners();
            });

            it('never notifies the listener', () => {
                event.trigger(null);
                expect(listener.called).to.be.false;
            });

        });

    });

    describe('#proxy', () => {

        context('when listener is added', () => {

            var proxy;

            beforeEach(() => {
                proxy = event.proxy();
                event.addListener(listener);
            });

            it('proxies notifications to the listener', () => {
                proxy();
                expect(listener.called).to.be.true;
            });

            it('proxies parameter to the listener', () => {
                proxy(456);
                expect(listener.callArg(0)).to.equal(456);
            });

        });

    });

});
