/// <reference path="../../base/string_identifier.ts" />
/// <reference path="../../base/entity.ts" />
/// <reference path="./mylist.ts" />

class MylistSetId extends StringIdentifier {
}

class MylistSet implements Entity<MylistSetId> {

    private mylistSet: { [id: string]: Mylist };

    constructor(
        private id: MylistSetId,
        mylists: Mylist[]
    ) {
        this.mylistSet = {};
        mylists.forEach((mylist: Mylist) => {
            this.mylistSet[mylist.getId().toString()] = mylist;
        });
    }

    getId(): MylistSetId {
        return this.id;
    }

    isSameAs(entity: MylistSet): boolean {
        return (this.id === entity.id);
    }

    getMylists(): Mylist[] {
        return Object.keys(this.mylistSet).map((id: string) => this.mylistSet[id]);
    }

}
