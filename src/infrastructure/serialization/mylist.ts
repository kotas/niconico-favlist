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

        toMylist(): Mylist {
            var reader = new util.UnserializationReader(this.serialized, ':');
            return new Mylist(
                MylistId.fromIdString(reader.readString(MylistColumn.MylistId)),
                reader.readString(MylistColumn.Title),
                this.unserializeVideos(reader.read(MylistColumn.NewVideos)),
                this.unserializeVideoIds(reader.read(MylistColumn.CheckedVideoIds))
            );
        }

        private unserializeVideos(serialized: string): Video[] {
            if (serialized) {
                return serialized.split(':').map(function (serializedVideo) {
                    return (new serialization.VideoUnserializer(serializedVideo)).toVideo();
                });
            } else {
                return [];
            }
        }

        private unserializeVideoIds(serialized: string): string[] {
            return serialized ? serialized.split(':') : [];
        }

    }

}
