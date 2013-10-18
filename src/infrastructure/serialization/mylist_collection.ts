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

        toMylists(): monapt.Try<Mylist[]> {
            return monapt.Try<Mylist[]>(() => {
                var mylists: Mylist[] = [];
                this.values.map((serialized: string) => {
                    (new serialization.MylistUnserializer(serialized)).toMylist().match({
                        Success: (mylist) => { mylists.push(mylist); },
                        Failure: (e)      => { throw e; }
                    });
                });
                return mylists;
            });
        }

    }

}
