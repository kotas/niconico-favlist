/// <reference path="./mylist_set.ts" />
/// <reference path="../../../../vendor/monapt/monapt.ts" />

interface MylistSetRepository {

    resolve(mylistId: MylistSetId): monapt.Future<monapt.Option<MylistSet>>;

    store(mylistSet: MylistSet): void;

}
