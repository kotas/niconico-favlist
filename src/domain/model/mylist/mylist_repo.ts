/// <reference path="./mylist.ts" />
/// <reference path="../../../../vendor/monapt/monapt.ts" />

interface MylistRepository {

    getAll(): Mylist[];

    resolve(mylistId: MylistId): monapt.Option<Mylist>;

    store(mylist: Mylist): void;

    storeList(mylists: Mylist[]): void;

    contains(mylist: Mylist): boolean;

    containsId(mylistId: MylistId): boolean;

    remove(mylist: Mylist): void;

    removeById(mylistId: MylistId): void;

}
