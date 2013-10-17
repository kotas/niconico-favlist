/// <reference path="./mylist.ts" />

class MylistCollection {

    constructor(
        private mylists: Mylist[]
    ) {
    }

    getMylists(): Mylist[] {
        return this.mylists;
    }

}
