/// <reference path="../../domain/model/mylist/mylist_set.ts" />
/// <reference path="./mylist.ts" />

module serialization {

    export class MylistSetSerializer {

        constructor(private mylistSet: MylistSet) {
        }

        toString(): string {
            return this.mylistSet.getMylists().
                map(mylist => (new serialization.MylistSerializer(mylist)).toString()).
                join('#');
        }

    }

    export class MylistSetUnserializer {

        constructor(private serialized: string) {
        }

        toMylistSet(): MylistSet {
            var values = this.serialized ? this.serialized.split('#')  : [];
            var mylists = values.map(s => (new serialization.MylistUnserializer(s)).toMylist());
            return new MylistSet(mylists);
        }

    }

}
