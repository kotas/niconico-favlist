/// <reference path="../../../../vendor/monapt/monapt.ts" />

interface KeyValueStorage {
    get(key: string): monapt.Option<any>;
    set(key: string, value: any): void;
}
