/// <reference path="../video.ts" />
/// <reference path="../../infrastructure/serialization.ts" />

module serialization {

    enum VideoColumn {
        VideoId,
        Title,
        URL,
        Thumbnail,
        Memo,
        Timestamp
    }

    export class VideoSerializer {

        constructor(private video: Video) {
        }

        toString(): string {
            var writer = new serialization.Writer('&');
            writer.putString(VideoColumn.VideoId, this.video.getVideoId());
            writer.putString(VideoColumn.Title, this.video.getTitle());
            writer.putString(VideoColumn.URL, this.video.getURL());
            writer.putString(VideoColumn.Thumbnail, this.video.getThumbnail());
            writer.putString(VideoColumn.Memo, this.video.getMemo());
            writer.putInteger(VideoColumn.Timestamp, this.video.getTimestamp());
            return writer.toString();
        }

    }

    export class VideoUnserializer {

        private reader: serialization.Reader;

        constructor(serialized: string) {
            this.reader = new serialization.Reader(serialized, /&/);
        }

        toVideo(): Video {
            return new Video(
                this.reader.getString(VideoColumn.VideoId),
                this.reader.getString(VideoColumn.Title),
                this.reader.getString(VideoColumn.URL),
                this.reader.getString(VideoColumn.Thumbnail),
                this.reader.getString(VideoColumn.Memo),
                this.getTimestamp(VideoColumn.Timestamp)
            );
        }

        private getTimestamp(index: number): number {
            var value = this.reader.getString(index);
            if (!value) {
                return null;
            }
            if (/^\d+$/.test(value)) {
                return parseInt(value, 10);
            }

            // Convert from old format
            var m = value.split(/\D+/);
            if (m.length !== 6) {
                return null;
            }

            var dt = new Date(
                parseInt(m[0], 10),
                parseInt(m[1], 10) - 1,
                parseInt(m[2], 10),
                parseInt(m[3], 10),
                parseInt(m[4], 10),
                parseInt(m[5], 10)
            );
            return dt.getTime();
        }

    }

}
