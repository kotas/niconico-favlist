/// <reference path="./mylist.ts" />
/// <reference path="../../../../vendor/monapt/monapt.ts" />

interface RemoteMylistRepository {

    resolve(mylistId: MylistId): monapt.Future<monapt.Option<Mylist>>;

}
