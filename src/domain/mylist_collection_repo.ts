/// <reference path="./serialization/mylist_collection.ts" />
/// <reference path="./mylist_collection.ts" />
/// <reference path="../infrastructure/data_storage.ts" />

class MylistCollectionRepository {

    constructor(private storage: DataStorage) {
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
