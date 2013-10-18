/// <reference path="../../base/string_identifier.ts" />
/// <reference path="../../base/entity.ts" />
/// <reference path="../../../../vendor/monapt/monapt.ts" />

class MylistFeedId extends StringIdentifier {
}

class MylistFeed implements Entity<MylistFeedId> {

    constructor(
        private id: MylistFeedId,
        private xml: string
    ) {
    }

    getId(): MylistFeedId {
        return this.id;
    }

    isSameAs(entity: MylistFeed): boolean {
        return (this.id === entity.id);
    }

    getTitle(): monapt.Option<string> {
        var matches = this.xml.match(/<title>(?:マイリスト )?(.+?)‐ニコニコ動画.*?<\/title>/);
        if (matches) {
            return new monapt.Some(matches[1]);
        } else {
            return new monapt.None<string>();
        }
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

class MylistFeedEntry {

    constructor(private xml: string) {
    }

    getTitle(): monapt.Option<string> {
        return this.scrape(/<title>(.*?)<\/title>/);
    }

    getURL(): monapt.Option<string> {
        return this.scrape(/<link rel="alternate" type="text\/html" href="(.+?)"\/>/);
    }

    getVideoId(): monapt.Option<string> {
        return this.getURL().flatMap(url => {
            var matches = url.match(/watch\/([^?&#]+)/);
            if (matches) {
                return new monapt.Some(matches[1]);
            } else {
                return new monapt.None<string>();
            }
        });
    }

    getThumbnail(): monapt.Option<string> {
        return this.scrape(/<img alt=".*?" src="(.+?)"/);
    }

    getMemo(): monapt.Option<string> {
        return this.scrape(/<p class="nico-memo">(.*?)<\/p>/);
    }

    getTimestamp(): monapt.Option<number> {
        var published = this.scrape(/<published>(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)<\/published>/);
        return published.map(s => Date.parse(s));
    }

    private scrape(pattern: RegExp): monapt.Option<string> {
        var matches = this.xml.match(pattern);
        if (matches) {
            return new monapt.Some(matches[1]);
        } else {
            return new monapt.None<string>();
        }
    }

}
