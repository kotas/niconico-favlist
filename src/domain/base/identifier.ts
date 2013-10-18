interface Identifier<ID extends Identifier<ID>> {
    toString(): string;
    valueOf(): any;
    isSameAs(id: ID): boolean;
}
