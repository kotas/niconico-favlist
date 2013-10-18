interface Repository<ID extends Identifier, E extends Entity<ID>> {
    getAll(): E[];
    resolve(id: ID): E;
    store(entity: E): E;
    contains(entity: E): boolean;
    containsId(id: ID): boolean;
    remove(entity: E): void;
    removeById(id: ID): void;
}
