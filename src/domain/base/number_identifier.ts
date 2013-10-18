/// <reference path="./identifier.ts" />

class NumberIdentifier<T extends NumberIdentifier> implements Identifier<T> {

    constructor(private id: number) {
    }

    toString(): string {
        return this.id.toString();
    }

    valueOf(): any {
        return this.id;
    }

    isSameAs(other: T): boolean {
        return (this.id === other.id);
    }

}
