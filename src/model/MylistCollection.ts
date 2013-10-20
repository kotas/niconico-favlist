/// <reference path="./Mylist.ts" />
/// <reference path="../util/EventEmitter.ts" />

class MylistCollection extends util.EventEmitter {

    constructor(private mylists: Mylist[]) {
        super();
    }

    getMylists(): Mylist[] {
        return this.mylists;
    }

    getVisibleMylists(): Mylist[] {
        return this.mylists;
    }

    get(mylistId: MylistId): Mylist {
        var index = this.indexOfId(mylistId);
        return index >= 0 ? this.mylists[index] : null;
    }

    add(mylist: Mylist): void {
        this.mylists.push(mylist);
        this.emitEvent('add', [mylist]);
    }

    remove(mylist: Mylist): boolean {
        return this.removeById(mylist.getMylistId());
    }

    removeById(mylistId: MylistId): boolean {
        var index = this.indexOfId(mylistId);
        if (index < 0) {
            return false;
        }

        var mylist = this.mylists[index];
        this.mylists.splice(index, 1);
        this.emitEvent('remove', [mylist]);
        return true;
    }

    private indexOfId(mylistId: MylistId): number {
        for (var i = 0, l = this.mylists.length; i < l; i++) {
            if (this.mylists[i].getMylistId().equalTo(mylistId)) {
                return i;
            }
        }
        return -1;
    }

}
