/// <reference path="./identifier.ts" />

interface Entity<E extends Entity<E, ID>, ID extends Identifier<ID>> {
    getId(): ID;
    isSameAs(entity: E): boolean;
}
