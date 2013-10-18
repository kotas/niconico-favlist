/// <reference path="../../domain/model/mylist/mylist.ts" />
/// <reference path="../util/writer.ts" />
/// <reference path="../util/reader.ts" />
/// <reference path="./video.ts" />

module serialization {

    enum MylistColumn {
        UserId, // deprecated
        MylistId,
        Title,
        CheckedVideoIds,
        NewVideos,
    }

    export class MylistSerializer {

        constructor(private mylist: Mylist) {
        }

        toString(): string {
            var writer = new util.SerializationWriter(';');
            writer.writeString(MylistColumn.MylistId,  this.mylist.getId().toString());
            writer.writeString(MylistColumn.Title,     this.mylist.getTitle());
            writer.write(MylistColumn.CheckedVideoIds, this.serializeVideoIds(this.mylist.getCheckedVideoIds()));
            writer.write(MylistColumn.NewVideos,       this.serializeVideos(this.mylist.getNewVideos()));
            return writer.toString();
        }

        private serializeVideoIds(videoIds: string[]): string {
            return videoIds.join(':');
        }

        private serializeVideos(videos: Video[]): string {
            var serializedVideos = videos.map(function (video) {
                return (new serialization.VideoSerializer(video)).toString()
            });
            return serializedVideos.join(':');
        }

    }

    export class MylistUnserializer {

        constructor(private serialized: string) {
        }

        toMylist(): monapt.Try<Mylist> {
            return monapt.Try<Mylist>(() => {
                var reader = new util.UnserializationReader(this.serialized, ':');
                return new Mylist(
                    reader.readString(MylistColumn.MylistId).map(MylistId.fromIdString).get(),
                    reader.readString(MylistColumn.Title).getOrElse(() => ''),
                    reader.read(MylistColumn.NewVideos).map(unserializeVideos).getOrElse(() => []),
                    reader.read(MylistColumn.CheckedVideoIds).map(unserializeVideoIds).getOrElse(() => [])
                );

                function unserializeVideos(serialized: string): Video[] {
                    if (!serialized) {
                        return [];
                    }

                    var videos: Video[] = [];
                    serialized.split(':').forEach((serializedVideo: string) => {
                        (new serialization.VideoUnserializer(serializedVideo)).toVideo().match({
                            Success: (video: Video) => { videos.push(video); },
                            Failure: (e: Error)     => { throw e; }
                        });
                    });
                    return videos;
                }

                function unserializeVideoIds(serialized: string): string[] {
                    return serialized ? serialized.split(':') : [];
                }
            });
        }

    }

}
