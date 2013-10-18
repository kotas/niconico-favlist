/// <reference path="../storage/kvs/key_value_storage.ts" />
/// <reference path="../serialization/mylist_collection.ts" />
/// <reference path="../../domain/model/mylist/mylist_repo.ts" />

class MylistMemoryRepository implements MylistRepository {

    private mylists: { [key: string]: Mylist } = {};

    constructor() {
    }

    getAll(): Mylist[] {
        return Object.keys(this.mylists).map((key: string) => this.mylists[key]);
    }

    resolve(mylistId: MylistId): monapt.Option<Mylist> {
        var key = mylistId.toString();
        if (this.mylists.hasOwnProperty(key)) {
            return new monapt.Some(this.mylists[key]);
        } else {
            return new monapt.None<Mylist>();
        }
    }

    store(mylist: Mylist): void {
        this.mylists[mylist.getId().toString()] = mylist;
    }

    storeList(mylists: Mylist[]): void {
        mylists.forEach(mylist => this.store(mylist));
    }

    contains(mylist: Mylist): boolean {
        return this.containsId(mylist.getId());
    }

    containsId(mylistId: MylistId): boolean {
        return this.mylists.hasOwnProperty(mylistId.toString());
    }

    remove(mylist: Mylist): void {
        this.removeById(mylist.getId());
    }

    removeById(mylistId: MylistId): void {
        var key = mylistId.toString();
        if (!this.mylists.hasOwnProperty(key)) {
            throw new Error('No such mylist in the repository');
        }
        delete this.mylists[key];
    }

}
