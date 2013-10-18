/// <reference path="../../../vendor/monapt/monapt.ts" />
/// <reference path="../../domain/model/mylist/mylist.ts" />
/// <reference path="../../domain/model/video/video.ts" />

module serialization {

    export class MylistFeedParser {

        constructor(private xml: string) {
        }

        toMylist(): monapt.Try<Mylist> {
            return monapt.Try<Mylist>(() => {
                return new Mylist(
                    this.getMylistId(),
                    this.getTitle(),
                    this.getVideos()
                );
            });
        }

        private getMylistId(): MylistId {
            var matches = this.xml.match(/<link rel="alternate" type="text\/html" href="(.+?)"\/>/);
            if (!matches) {
                throw new Error('Unknown feed format');
            }
            return MylistId.fromURL(matches[1]);
        }

        private getTitle(): string {
            var matches = this.xml.match(/<title>(?:マイリスト )?(.+?)‐ニコニコ動画.*?<\/title>/);
            return matches ? matches[1] : '';
        }

        private getVideos(): Video[] {
            var videos: Video[] = [];
            var pattern = /<entry>([\S\s]*?)<\/entry>/g;
            var matches: RegExpExecArray;
            while (matches = pattern.exec(this.xml)) {
                var parser = new MylistFeedEntryParser(matches[1]);
                videos.push(parser.toVideo());
            }
            return videos;
        }

    }

    class MylistFeedEntryParser {

        constructor(private xml: string) {
        }

        toVideo(): Video {
            return new Video(
                this.getVideoId(),
                this.getTitle(),
                this.getURL(),
                this.getThumbnail(),
                this.getMemo(),
                this.getTimestamp()
            );
        }

        private getTitle(): string {
            return this.scrape(/<title>(.*?)<\/title>/, '');
        }

        private getURL(): string {
            return this.scrapeOrDie(/<link rel="alternate" type="text\/html" href="(.+?)"\/>/);
        }

        private getVideoId(): string {
            var matches = this.getURL().match(/watch\/([^?&#]+)/);
            if (!matches) {
                throw new Error('Unknown feed format');
            }
            return matches[1];
        }

        private getThumbnail(): string {
            return this.scrapeOrDie(/<img alt=".*?" src="(.+?)"/);
        }

        private getMemo(): string {
            return this.scrape(/<p class="nico-memo">(.*?)<\/p>/, '');
        }

        private getTimestamp(): number {
            var published = this.scrapeOrDie(/<published>(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)<\/published>/);
            return Date.parse(published);
        }

        private scrape(pattern: RegExp, defaultValue: string): string {
            var matches = this.xml.match(pattern);
            return matches ? matches[1] : defaultValue;
        }

        private scrapeOrDie(pattern: RegExp): string {
            var value = this.scrape(pattern, null);
            if (value === null) {
                throw new Error('Unknown feed format');
            }
            return value;
        }

    }

}
