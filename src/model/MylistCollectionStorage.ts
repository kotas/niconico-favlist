/// <reference path="../util/Storage.ts" />
/// <reference path="../util/Event.ts" />
/// <reference path="./MylistCollection.ts" />
/// <reference path="./MylistCollectionSerializer.ts" />

interface IMylistCollectionStorage {
    onUpdate: util.IEvent<void>;
    checkUpdate(): void;
    get(): MylistCollection;
    store(mylistCollection: MylistCollection): void;
}

class MylistCollectionStorage implements IMylistCollectionStorage {

    onUpdate = new util.Event<void>();

    private updateTime: util.UpdateTimeStorage;
    private serializer: MylistCollectionSerializer;

    constructor(private storage: util.IStorage) {
        this.updateTime = new util.UpdateTimeStorage(storage, 'favlistLastUpdateTime');
        this.serializer = new MylistCollectionSerializer();
    }

    checkUpdate(): void {
        if (this.updateTime.isChanged()) {
            this.updateTime.fetch();
            this.onUpdate.trigger(null);
        }
    }

    get(): MylistCollection {
        var serialized: string = this.storage.get('favlist');
        var mylistCollection = this.serializer.unserialize(serialized);
        this.updateTime.fetch();
        return mylistCollection;
    }

    store(mylistCollection: MylistCollection): void {
        var serialized: string = this.serializer.serialize(mylistCollection);
        this.storage.set('favlist', serialized);
        this.updateTime.update();
    }

}
