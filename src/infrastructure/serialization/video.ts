/// <reference path="../../domain/model/video/video.ts" />
/// <reference path="../util/writer.ts" />
/// <reference path="../util/reader.ts" />
/// <reference path="./video.ts" />

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
            var writer = new util.SerializationWriter('&');
            writer.writeString(VideoColumn.VideoId, this.video.getVideoId());
            writer.writeString(VideoColumn.Title, this.video.getTitle());
            writer.writeString(VideoColumn.URL, this.video.getURL());
            writer.writeString(VideoColumn.Thumbnail, this.video.getThumbnail());
            writer.writeString(VideoColumn.Memo, this.video.getMemo());
            writer.writeInteger(VideoColumn.Timestamp, this.video.getTimestamp());
            return writer.toString();
        }

    }

    export class VideoUnserializer {

        constructor(private serialized: string) {
        }

        toVideo(): monapt.Try<Video> {
            return monapt.Try<Video>(() => {
                var reader = new util.UnserializationReader(this.serialized, '&');
                return new Video(
                    reader.readString(VideoColumn.VideoId).get(),
                    reader.readString(VideoColumn.Title).getOrElse(() => ''),
                    reader.readString(VideoColumn.URL).get(),
                    reader.readString(VideoColumn.Thumbnail).get(),
                    reader.readString(VideoColumn.Memo).getOrElse(() => ''),
                    reader.read(VideoColumn.Timestamp).map(parseTimestamp).get()
                );
            });

            function parseTimestamp(serialized: string): number {
                if (!serialized) {
                    return null;
                }
                if (/^\d+$/.test(serialized)) {
                    return parseInt(serialized, 10);
                }

                // Convert from old format
                var m = serialized.split(/\D+/);
                if (m.length !== 6) {
                    return null;
                }

                var dt = new Date(
                    parseInt(m[0], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10),
                    parseInt(m[3], 10), parseInt(m[4], 10),     parseInt(m[5], 10)
                );
                return dt.getTime();
            }
        }

    }

}
