/// <reference path="../../domain/model/mylist/mylist.ts" />
/// <reference path="./mylist.ts" />

module serialization {

    export class MylistCollectionSerializer {

        constructor(private mylists: Mylist[]) {
        }

        toString(): string {
            var serializedMylists: string[] = this.mylists.map(function (mylist) {
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

        toMylists(): Mylist[] {
            return this.values.map(function (serializedMylist) {
                return (new serialization.MylistUnserializer(serializedMylist)).toMylist();
            });
        }

    }

}
