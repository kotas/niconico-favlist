/// <reference path="./identifier.ts" />

class StringIdentifier<T extends StringIdentifier> implements Identifier<T> {

    constructor(private id: string) {
    }

    toString(): string {
        return this.id;
    }

    valueOf(): any {
        return this.id;
    }

    isSameAs(other: T): boolean {
        return (this.id === other.id);
    }

}
