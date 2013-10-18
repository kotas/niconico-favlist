/// <reference path="./key_value_storage.ts" />

class LocalStorage implements KeyValueStorage<any> {

    get(key: string): monapt.Option<any> {
        var value = window.localStorage[key];
        if (typeof value !== 'undefined') {
            return new monapt.Some(value);
        } else {
            return new monapt.None<any>();
        }
    }

    set(key: string, value: any): void {
        window.localStorage[key] = value;
    }

}
