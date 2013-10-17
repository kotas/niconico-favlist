/// <reference path="../entity/video.ts" />
/// <reference path="../entity/mylist.ts" />
/// <reference path="../entity/mylist_collection.ts" />

declare function escape(s: string): string;
declare function unescape(s: string): string;

module serialization {

    class Reader {

        private data: string[];

        constructor(serialized: string, delimiter: RegExp) {
            this.data = serialized ? serialized.split(delimiter) : [];
        }

        get(index: number, defaultValue: string = null): string {
            return (typeof this.data[index] !== 'undefined') ? this.data[index] : defaultValue;
        }

        getString(index: number, defaultValue: string = null): string {
            var value = this.get(index);
            return (value === null ? unescape(value) : defaultValue);
        }

        getInteger(index: number, defaultValue: number = null): number {
            var value = this.getString(index);
            if (typeof value !== 'undefined') {
                var num = parseInt(value, 10);
                return isNaN(num) ? defaultValue : num;
            } else {
                return defaultValue;
            }
        }

    }

    class Writer {

        private data: string[] = [];

        constructor(private delimiter: string) {
        }

        put(index: number, value: string): void {
            this.data[index] = value;
        }

        putString(index: number, value: string): void {
            this.put(index, escape(value));
        }

        putInteger(index: number, value: number): void {
            this.putString(index, value.toString());
        }

        toString(): string {
            return this.data.join(this.delimiter);
        }

    }


    enum VideoColumn {
        VideoId,
        Title,
        URL,
        Thumbnail,
        Memo,
        Timestamp
    }

    class VideoSerializer {

        constructor(private video: Video) {
        }

        toString(): string {
            var writer = new Writer('&');
            writer.putString(VideoColumn.VideoId, this.video.getVideoId());
            writer.putString(VideoColumn.Title, this.video.getTitle());
            writer.putString(VideoColumn.URL, this.video.getURL());
            writer.putString(VideoColumn.Thumbnail, this.video.getThumbnail());
            writer.putString(VideoColumn.Memo, this.video.getMemo());
            writer.putInteger(VideoColumn.Timestamp, this.video.getTimestamp());
            return writer.toString();
        }

    }

    class VideoUnserializer {

        private reader: Reader;

        constructor(serialized: string) {
            this.reader = new Reader(serialized, /&/);
        }

        toVideo(): Video {
            return new Video(
                this.reader.getString(VideoColumn.VideoId),
                this.reader.getString(VideoColumn.Title),
                this.reader.getString(VideoColumn.URL),
                this.reader.getString(VideoColumn.Thumbnail),
                this.reader.getString(VideoColumn.Memo),
                this.reader.getInteger(VideoColumn.Timestamp)
            );
        }
    }


    enum MylistColumn {
        UserId, // deprecated
        MylistId,
        Title,
        CheckedVideoIds,
        NewVideos,
    }

    class MylistSerializer {

        constructor(private mylist: Mylist) {
        }

        toString(): string {
            var writer = new Writer(';');
            writer.putString(MylistColumn.MylistId, this.mylist.getMylistId());
            writer.putString(MylistColumn.Title, this.mylist.getTitle());
            writer.put(MylistColumn.CheckedVideoIds, this.serializeCheckedVideoIds());
            writer.put(MylistColumn.NewVideos, this.serializeNewVideos());
            return writer.toString();
        }

        private serializeCheckedVideoIds(): string {
            return this.mylist.getCheckedVideoIds().join(':');
        }

        private serializeNewVideos(): string {
            var serializedVideos = this.mylist.getNewVideos().map(function (video) {
                return (new VideoSerializer(video)).toString()
            });
            return serializedVideos.join(':');
        }

    }

    class MylistUnserializer {

        private reader: Reader;

        constructor(serialized: string) {
            this.reader = new Reader(serialized, /;/);
        }

        toMylist(): Mylist {
            return new Mylist(
                this.reader.getString(MylistColumn.MylistId),
                this.reader.getString(MylistColumn.Title),
                this.getVideoIds(MylistColumn.CheckedVideoIds),
                this.getVideos(MylistColumn.NewVideos)
            );
        }

        private getVideoIds(index: MylistColumn): string[] {
            var str =  this.reader.get(index);
            return str ? str.split(/:/) : [];
        }

        private getVideos(index: MylistColumn): Video[] {
            var str = this.reader.get(index);
            if (str) {
                return str.split(/:/).map(function (serializedVideo) {
                    return (new VideoUnserializer(serializedVideo)).toVideo();
                });
            } else {
                return [];
            }
        }

    }


    export class MylistCollectionSerializer {

        constructor(private collection: MylistCollection) {
        }

        toString(): string {
            var serializedMylists: string[] = this.collection.getMylists().map(function (mylist) {
                return (new MylistSerializer(mylist)).toString();
            });
            return serializedMylists.join('#');
        }

    }

    export class MylistCollectionUnserializer {

        private values: string[];

        constructor(serialized: string) {
            this.values = serialized ? serialized.split(/#/) : [];
        }

        toMylistCollection(): MylistCollection {
            var mylists = this.values.map(function (serializedMylist) {
                return (new MylistUnserializer(serializedMylist)).toMylist();
            });
            return new MylistCollection(mylists);
        }

    }

}
