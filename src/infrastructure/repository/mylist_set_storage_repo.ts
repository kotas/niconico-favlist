/// <reference path="../storage/kvs/key_value_storage.ts" />
/// <reference path="../serialization/mylist_collection.ts" />
/// <reference path="../../domain/model/mylist/mylist_set_repo.ts" />

class MylistStorageRepository implements MylistSetRepository {

    constructor(private storage: KeyValueStorage<string>) {
    }

    resolve(mylistId: MylistSetId): monapt.Future<monapt.Option<MylistSet>> {
        return monapt.Future<monapt.Option<MylistSet>>(promise => {
            var mylistSet: monapt.Option<MylistSet> = this.storage.get(mylistId.toString()).map(unserialize);
            promise.success(mylistSet);
        });

        function unserialize(serialized: string): MylistSet {
            var mylists = (new serialization.MylistCollectionUnserializer(serialized)).toMylists();
            return new MylistSet(mylistId, mylists);
        }
    }

    store(mylistSet: MylistSet): void {
        var serialized = (new serialization.MylistCollectionSerializer(mylistSet.getMylists())).toString();
        this.storage.set(mylistSet.getId().toString(), serialized);
    }

}
