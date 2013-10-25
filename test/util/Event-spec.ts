/// <reference path="../spec_helper.ts" />

describe('util.Event', () => {

    var event: util.Event<any>;
    var listener: SinonSpy;
    var listener2: SinonSpy;
    beforeEach(() => {
        event = new util.Event<any>();
        listener = sinon.spy();
        listener2 = sinon.spy();
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
                expect(listener.calledTwice).to.be.true;
            });

            it('passes a parameter to the listener', () => {
                event.trigger(123);
                expect(listener.calledWith(123)).to.be.true;
            });

        });

        context('when many listeners are added', () => {

            beforeEach(() => {
                event.addListener(listener);
                event.addListener(listener2);
            });

            it('notifies all of them', () => {
                event.trigger(null);
                expect(listener.called).to.be.true;
                expect(listener2.called).to.be.true;
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

        context('when one of listeners is removed', () => {

            beforeEach(() => {
                event.addListener(listener);
                event.addListener(listener2);
                event.removeListener(listener);
            });

            it('never notifies the removed listener', () => {
                event.trigger(null);
                expect(listener.called).to.be.false;
            });

            it('notifies the listener not removed', () => {
                event.trigger(null);
                expect(listener2.called).to.be.true;
            });

        });

        context('when all listeners get cleared', () => {

            beforeEach(() => {
                event.addListener(listener);
                event.addListener(listener2);
                event.clearListeners();
            });

            it('never notifies cleared listeners', () => {
                event.trigger(null);
                expect(listener.called).to.be.false;
                expect(listener2.called).to.be.false;
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
                expect(listener.calledWith(456)).to.be.true;
            });

        });

    });

});
