
enum MylistIdType {
    Mylist,
    User,
}

class MylistId {

    static fromURL(url: string): MylistId {
        var matches: string[];
        if (matches = url.match(/\/mylist\/(?:\d+\/)?(\d+)/)) {
            return new MylistId(MylistIdType.Mylist, matches[1]);
        } else if (matches = url.match(/\/user\/(\d+)/)) {
            return new MylistId(MylistIdType.User, matches[2]);
        } else {
            throw new Error('Unknown URL format');
        }
    }

    static fromIdString(idString: string): MylistId {
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
    ) {}

    equalTo(other: MylistId): boolean {
        return (this.idType === other.idType && this.idValue === other.idValue);
    }

    getIdType(): MylistIdType {
        return this.idType;
    }

    getIdValue(): string {
        return this.idValue;
    }

    toPath(): string {
        switch (this.idType) {
            case MylistIdType.Mylist: return 'mylist/' + this.idValue;
            case MylistIdType.User:   return 'user/' + this.idValue + '/video';
        }
        throw new Error('Unknown ID type');
    }

    toString(): string {
        switch (this.idType) {
            case MylistIdType.Mylist: return 'mylist/' + this.idValue;
            case MylistIdType.User:   return 'myvideo/' + this.idValue;
        }
        throw new Error('Unknown ID type');
    }

}
