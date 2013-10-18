/// <reference path="../../../../typings/greasemonkey.d.ts" />
/// <reference path="./key_value_storage.ts" />

class GresemonkeyStorage implements KeyValueStorage {

    static isAvailable(): boolean {
        return (typeof GM_getValue !== 'undefined');
    }

    get(key: string): monapt.Option<any> {
        var value = GM_getValue(key);
        if (typeof value !== 'undefined') {
            return new monapt.Some(value);
        } else {
            return new monapt.None<any>();
        }
    }

    set(key: string, value: any): void {
        GM_setValue(key, value);
    }

}
