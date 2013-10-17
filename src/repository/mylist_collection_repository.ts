/// <reference path="./serialization.ts" />
/// <reference path="../entity/mylist_collection.ts" />
/// <reference path="../util/storage.ts" />

class MylistCollectionRepository {

    constructor(private storage: util.Storage) {
    }

    get(): MylistCollection {
        var serialized = this.storage.getString('favlist');
        return (new serialization.MylistCollectionUnserializer(serialized)).toMylistCollection();
    }

    store(collection: MylistCollection) {
        var serialized = (new serialization.MylistCollectionSerializer(collection)).toString();
        this.storage.setString('favlist', serialized);
    }

}
