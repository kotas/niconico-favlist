/// <reference path="./identifier.ts" />

class StringIdentifier<ID extends Identifier<ID>> implements Identifier<ID> {

    constructor(private id: string) {
    }

    toString(): string {
        return this.id;
    }

    valueOf(): any {
        return this.id;
    }

    isSameAs(other: ID): boolean {
        if (other instanceof StringIdentifier) {
            return (this.id === other.toString());
        }
        return false;
    }

}
