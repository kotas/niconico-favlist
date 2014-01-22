/// <reference path="../../spec_helper.ts" />

describe('util.StringUtil', () => {

    describe('.unescapeHTML', () => {

        var escaped = 'a&amp;b&lt;c&gt;d&quot;e&#039;f&amp;lt;';
        var unescaped = 'a&b<c>d"e\'f&lt;';

        it('unescapes HTML entities in a string', () => {
            expect(util.unescapeHTML(escaped)).to.equal(unescaped);
        });

    });

});
