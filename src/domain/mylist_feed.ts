/// <reference path="./mylist_id.ts" />

class MylistFeedEntry {

    constructor(private xml: string) {
    }

    getTitle(): string {
        return this.scrape(/<title>(.*?)<\/title>/);
    }

    getURL(): string {
        return this.scrape(/<link rel="alternate" type="text\/html" href="(.+?)"\/>/);
    }

    getVideoId(): string {
        var matches = this.getURL().match(/watch\/([^?&#]+)/);
        return matches ? matches[1] : null;
    }

    getThumbnail(): string {
        return this.scrape(/<img alt=".*?" src="(.+?)"/);
    }

    getMemo(): string {
        return this.scrape(/<p class="nico-memo">(.*?)<\/p>/);
    }

    getTimestamp(): number {
        var published = this.scrape(/<published>(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)<\/published>/);
        return Date.parse(published);
    }

    private scrape(pattern: RegExp): string {
        var matches = this.xml.match(pattern);
        return matches ? matches[1] : null;
    }

}

class MylistFeed {

    constructor(
        private url: string,
        private xml: string
    ) {
    }

    getMylistId(): MylistId {
        return MylistId.createFromURL(this.url);
    }

    getTitle(): string {
        var matched = this.xml.match(/<title>(?:マイリスト )?(.+?)‐ニコニコ動画.*?<\/title>/);
        return matched ? matched[1] : '';
    }

    getEntries(): MylistFeedEntry[] {
        var entries: MylistFeedEntry[] = [];
        var re_entry = /<entry>([\S\s]*?)<\/entry>/g;
        var matched: RegExpExecArray;
        while (matched = re_entry.exec(this.xml)) {
            entries.push(new MylistFeedEntry(matched[1]));
        }
        return entries;
    }

}
