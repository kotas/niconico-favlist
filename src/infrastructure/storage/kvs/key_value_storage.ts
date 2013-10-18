/// <reference path="../../../../vendor/monapt/monapt.ts" />

interface KeyValueStorage<V> {
    get(key: string): monapt.Option<V>;
    set(key: string, value: V): void;
}
