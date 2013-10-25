/// <reference path="../spec_helper.ts" />

describe('Config', () => {

    var checkInterval   = 123;
    var maxNewVideos    = 45;
    var hideCheckedList = true;
    var orderDescendant = false;

    var config: Config = new Config(
        checkInterval,
        maxNewVideos,
        hideCheckedList,
        orderDescendant
    );

    context('with configurations for constructor', () => {

        it('returns checkInterval', () => {
            expect(config.getCheckInterval()).to.equal(checkInterval);
        });

        it('returns maxNewVideos', () => {
            expect(config.getMaxNewVideos()).to.equal(maxNewVideos);
        });

        it('returns hideCheckedList', () => {
            expect(config.isCheckedListHidden()).to.equal(hideCheckedList);
        });

        it('returns orderDescendant', () => {
            expect(config.isOrderDescendant()).to.equal(orderDescendant);
        });

    });

    context('when updated', () => {

        var updated: Config;

        before(() => {
            updated = new Config();
            updated.update(config);
        });

        it('returns checkInterval', () => {
            expect(updated.getCheckInterval()).to.equal(checkInterval);
        });

        it('returns maxNewVideos', () => {
            expect(updated.getMaxNewVideos()).to.equal(maxNewVideos);
        });

        it('returns hideCheckedList', () => {
            expect(updated.isCheckedListHidden()).to.equal(hideCheckedList);
        });

        it('returns orderDescendant', () => {
            expect(updated.isOrderDescendant()).to.equal(orderDescendant);
        });

    });

});
