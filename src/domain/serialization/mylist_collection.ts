/// <reference path="./mylist.ts" />
/// <reference path="../mylist_collection.ts" />

module serialization {

    export class MylistCollectionSerializer {

        constructor(private collection: MylistCollection) {
        }

        toString(): string {
            var serializedMylists: string[] = this.collection.getMylists().map(function (mylist) {
                return (new serialization.MylistSerializer(mylist)).toString();
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
                return (new serialization.MylistUnserializer(serializedMylist)).toMylist();
            });
            return new MylistCollection(mylists);
        }

    }

}
