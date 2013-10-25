
interface IMylistFeed {
    getTitle(): string;
    getVideos(): Video[];
}

class MylistFeed implements IMylistFeed {

    constructor(private xml: string) {}

    getTitle(): string {
        var matched = this.xml.match(/<title>(?:マイリスト )?(.+?)‐ニコニコ動画.*?<\/title>/);
        return matched ? matched[1] : '';
    }

    getVideos(): Video[] {
        var videos: Video[] = [];
        var re_entry = /<entry>([\S\s]*?)<\/entry>/g;
        var matched: RegExpExecArray;
        while (matched = re_entry.exec(this.xml)) {
            videos.push(new MylistFeedEntry(matched[1]).toVideo());
        }
        return videos;
    }

}

class MylistFeedEntry {

    constructor(private xml: string) {}

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
        return this.scrape(/<title>(.*?)<\/title>/);
    }

    private getURL(): string {
        return this.scrape(/<link rel="alternate" type="text\/html" href="(.+?)"\/>/);
    }

    private getVideoId(): string {
        var matches = this.getURL().match(/watch\/([^?&#]+)/);
        return matches ? matches[1] : null;
    }

    private getThumbnail(): string {
        return this.scrape(/<img alt=".*?" src="(.+?)"/);
    }

    private getMemo(): string {
        return this.scrape(/<p class="nico-memo">((?:.|\n)*?)<\/p>/);
    }

    private getTimestamp(): number {
        var published = this.scrape(/<published>(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)<\/published>/);
        return Date.parse(published);
    }

    private scrape(pattern: RegExp): string {
        var matches = this.xml.match(pattern);
        return matches ? matches[1] : null;
    }

}
