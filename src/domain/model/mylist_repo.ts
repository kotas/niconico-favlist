/// <reference path="./serialization/mylist.ts" />
/// <reference path="./mylist.ts" />
/// <reference path="../../infrastructure/repository.ts" />
/// <reference path="../../infrastructure/data_storage.ts" />

class MylistRepository implements Repository<MylistId, Mylist> {

    private mylists: { [key: string]: Mylist };

    constructor(private storage: DataStorage) {
    }

    getAll(): Mylist[] {
        this.load();
        return Object.keys(this.mylists).map((key) => this.mylists[key]);
    }

    resolve(mylistId: MylistId): Mylist {
        this.load();
        var key = mylistId.toString();
        if (!this.mylists.hasOwnProperty(key)) {
            throw new Error('No such mylist in the repository');
        }
        return this.mylists[key];
    }

    store(mylist: Mylist): Mylist {
        this.load();
        this.mylists[mylist.getId().toString()] = mylist;
        this.save();
        return mylist;
    }

    contains(mylist: Mylist): boolean {
        return this.containsId(mylist.getId());
    }

    containsId(mylistId: MylistId): boolean {
        this.load();
        return this.mylists.hasOwnProperty(mylistId.toString());
    }

    remove(mylist: Mylist): void {
        this.removeById(mylist.getId());
    }

    removeById(mylistId: MylistId): void {
        this.load();
        var key = mylistId.toString();
        if (!this.mylists.hasOwnProperty(key)) {
            throw new Error('No such mylist in the repository');
        }
        delete this.mylists[key];
        this.save();
    }

    private load() {
        if (!this.mylists) {
            var serialized = this.storage.getString('favlist');
            var mylistArray = (new serialization.MylistCollectionUnserializer(serialized)).toMylists();
            this.mylists = {};
            mylistArray.forEach((mylist: Mylist) => this.mylists[mylist.getId().toString()] = mylist);
        }
    }

    private save() {
        if (this.mylists) {
            var serialized = (new serialization.MylistCollectionSerializer(this.getAll())).toString();
            this.storage.setString('favlist', serialized);
        }
    }

}
