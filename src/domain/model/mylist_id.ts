/// <reference path="../../infrastructure/identifier.ts" />

enum MylistIdType {
    Mylist,
    User,
}

class MylistId implements Identifier {

    static createFromURL(url: string): MylistId {
        var matches: string[];
        if (matches = url.match(/\/mylist\/(?:\d+\/)?(\d+)/)) {
            return new MylistId(MylistIdType.Mylist, matches[1]);
        } else if (matches = url.match(/\/user\/(\d+)/)) {
            return new MylistId(MylistIdType.User, matches[2]);
        } else {
            throw new Error('Unknown URL format');
        }
    }

    static createFromString(idString: string): MylistId {
        var matches: string[];
        if (matches = idString.match(/^mylist\/(?:\d+\/)?(\d+)|^(\d+)$/)) {
            return new MylistId(MylistIdType.Mylist, matches[1] || matches[2]);
        } else if (matches = idString.match(/^myvideo\/(\d+)/)) {
            return new MylistId(MylistIdType.User, matches[1]);
        } else {
            throw new Error('Unknown ID format');
        }
    }

    constructor(
        private idType: MylistIdType,
        private idValue: string
    ) {
    }

    getIdType(): MylistIdType {
        return this.idType;
    }

    getIdValue(): string {
        return this.idValue;
    }

    toString(): string {
        switch (this.idType) {
            case MylistIdType.Mylist: return 'mylist/' + this.idValue;
            case MylistIdType.User:   return 'myvideo/' + this.idValue;
        }
        throw new Error('Unknown ID type');
    }

}
