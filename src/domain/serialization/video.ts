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
                this.reader.getInteger(VideoColumn.Timestamp)
            );
        }
    }

}
