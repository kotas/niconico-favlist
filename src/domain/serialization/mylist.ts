/// <reference path="./video.ts" />
/// <reference path="../mylist.ts" />
/// <reference path="../../infrastructure/serialization.ts" />

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
            var writer = new serialization.Writer(';');
            writer.putString(MylistColumn.MylistId, this.mylist.getId().toString());
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
                return (new serialization.VideoSerializer(video)).toString()
            });
            return serializedVideos.join(':');
        }

    }

    export class MylistUnserializer {

        private reader: serialization.Reader;

        constructor(serialized: string) {
            this.reader = new serialization.Reader(serialized, /;/);
        }

        toMylist(): Mylist {
            return new Mylist(
                this.getMylistId(MylistColumn.MylistId),
                this.reader.getString(MylistColumn.Title),
                this.getVideos(MylistColumn.NewVideos),
                this.getVideoIds(MylistColumn.CheckedVideoIds)
            );
        }

        private getMylistId(index: MylistColumn): MylistId {
            var idStr = this.reader.getString(index);
            return MylistId.createFromString(idStr);
        }

        private getVideos(index: MylistColumn): Video[] {
            var str = this.reader.get(index);
            if (str) {
                return str.split(/:/).map(function (serializedVideo) {
                    return (new serialization.VideoUnserializer(serializedVideo)).toVideo();
                });
            } else {
                return [];
            }
        }

        private getVideoIds(index: MylistColumn): string[] {
            var str =  this.reader.get(index);
            return str ? str.split(/:/) : [];
        }

    }


    export class MylistCollectionSerializer {

        constructor(private mylists: Mylist[]) {
        }

        toString(): string {
            var serializedMylists: string[] = this.mylists.map(function (mylist) {
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

        toMylists(): Mylist[] {
            return this.values.map(function (serializedMylist) {
                return (new MylistUnserializer(serializedMylist)).toMylist();
            });
        }

    }

}
