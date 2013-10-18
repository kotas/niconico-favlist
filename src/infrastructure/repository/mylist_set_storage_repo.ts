/// <reference path="../storage/kvs/key_value_storage.ts" />
/// <reference path="../serialization/mylist_collection.ts" />
/// <reference path="../../domain/model/mylist/mylist_set_repo.ts" />

class MylistSetStorageRepository implements MylistSetRepository {

    constructor(private storage: KeyValueStorage) {
    }

    resolve(mylistSetId: MylistSetId): monapt.Future<monapt.Option<MylistSet>> {
        return monapt.future<monapt.Option<MylistSet>>((promise) => {
            this.storage.get(mylistSetId.toString()).match({
                Some: (serialized: string) => {
                    tryUnserialize(serialized).match({
                        Success: (mylistSet) => promise.success(mylistSet),
                        Failure: (e)         => promise.failure(e)
                    });
                },
                None: () => {
                    promise.success(new monapt.None<MylistSet>())
                }
            });
        });

        function tryUnserialize(serialized: string): monapt.Try<MylistSet> {
            var mylists = (new serialization.MylistCollectionUnserializer(serialized)).toMylists();
            return mylists.map((mylists: Mylist[]): MylistSet => {
                return new MylistSet(mylistSetId, mylists);
            });
        }
    }

    store(mylistSet: MylistSet): void {
        var serialized = (new serialization.MylistCollectionSerializer(mylistSet.getMylists())).toString();
        this.storage.set(mylistSet.getId().toString(), serialized);
    }

}
