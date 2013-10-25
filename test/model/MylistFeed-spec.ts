/// <reference path="../spec_helper.ts" />

describe('MylistFeed', () => {

    var feedXML = [
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>",
        "<feed xmlns=\"http:\/\/www.w3.org\/2005\/Atom\" xml:lang=\"ja-jp\">",
        "  <title>\u30de\u30a4\u30ea\u30b9\u30c8 test feed\u2010\u30cb\u30b3\u30cb\u30b3\u52d5\u753b<\/title>",
        "  <subtitle>mylist description<\/subtitle>",
        "  <link rel=\"alternate\" type=\"text\/html\" href=\"http:\/\/www.nicovideo.jp\/mylist\/123\"\/>",
        "  <link rel=\"self\" type=\"application\/atom+xml\" href=\"http:\/\/www.nicovideo.jp\/mylist\/123?rss=atom&amp;nodescription=1&amp;noinfo=1\"\/>",
        "  <id>tag:nicovideo.jp,2013-01-01:\/mylist\/123<\/id>",
        "  <updated>2013-01-01T00:00:00+09:00<\/updated>",
        "  <author><name>author name<\/name><\/author>",
        "  <generator uri=\"http:\/\/www.nicovideo.jp\/\">\u30cb\u30b3\u30cb\u30b3\u52d5\u753b<\/generator>",
        "  <rights>(c) niwango, inc. All rights reserved.<\/rights>",
        "",
        "  <entry>",
        "    <title>video title1<\/title>",
        "    <link rel=\"alternate\" type=\"text\/html\" href=\"http:\/\/www.nicovideo.jp\/watch\/sm1\"\/>",
        "    <id>tag:nicovideo.jp,2013-01-01:\/watch\/1234567890<\/id>",
        "    <published>2013-01-01T01:23:45+09:00<\/published>",
        "    <updated>2013-01-01T01:23:45+09:00<\/updated>",
        "    <content type=\"html\"><![CDATA[<p class=\"nico-memo\">test memo1<\/p><p class=\"nico-thumbnail\"><img alt=\"video title1\" src=\"http:\/\/example.com\/t\/sm1\" width=\"94\" height=\"70\" border=\"0\"\/><\/p>]]><\/content>",
        "  <\/entry>",
        "",
        "  <entry>",
        "    <title>video title2<\/title>",
        "    <link rel=\"alternate\" type=\"text\/html\" href=\"http:\/\/www.nicovideo.jp\/watch\/sm2\"\/>",
        "    <id>tag:nicovideo.jp,2013-01-01:\/watch\/1234567891<\/id>",
        "    <published>2013-02-02T12:34:56+09:00<\/published>",
        "    <updated>2013-03-03T012:34:56+09:00<\/updated>",
        "    <content type=\"html\"><![CDATA[<p class=\"nico-memo\"><\/p><p class=\"nico-thumbnail\"><img alt=\"video title2\" src=\"http:\/\/example.com\/t\/sm2\" width=\"94\" height=\"70\" border=\"0\"\/><\/p>]]><\/content>",
        "  <\/entry>",
        "<\/feed>"
    ].join("\n");

    var feed = new MylistFeed(feedXML);

    describe('#getTitle', () => {

        it('extracts title from feed title', () => {
            expect(feed.getTitle()).to.equal('test feed');
        });

    });

    describe('#getVideos', () => {

        it('converts all entries into videos', () => {
            expect(feed.getVideos()).to.be.lengthOf(2);
        });

        it('extracts video ID from entry URL', () => {
            expect(feed.getVideos()[0].getVideoId()).to.equal('sm1');
        });

        it('extracts video title from entry title', () => {
            expect(feed.getVideos()[0].getTitle()).to.equal('video title1');
        });

        it('extracts video URL from entry URL', () => {
            expect(feed.getVideos()[0].getURL()).to.equal('http://www.nicovideo.jp/watch/sm1');
        });

        it('extracts thumbnail URL from entry content', () => {
            expect(feed.getVideos()[0].getThumbnail()).to.equal('http://example.com/t/sm1');
        });

        it('extracts video memo fron entry content', () => {
            expect(feed.getVideos()[0].getMemo()).to.equal('test memo1');
        });

        it('converts published time into timestamp', () => {
            expect(feed.getVideos()[0].getTimestamp()).to.equal(1356971025000);
        });

    });

});
