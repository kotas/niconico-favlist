/// <reference path="../storage/kvs/key_value_storage.ts" />

// We have to use escape/unescape for backward compatibility
declare function unescape(s: string): string;

module util {

    export class Reader<K, V> {

        read(key: K): monapt.Option<V> {
            throw new Error('Not implemented');
        }

        readString(key: K): monapt.Option<string> {
            return this.read(key).map(v => v.toString());
        }

        readInteger(key: K): monapt.Option<number> {
            return this.read(key).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
        }

        readBoolean(key: K): monapt.Option<boolean> {
            return this.read(key).map(v => v.toString() !== '0');
        }

    }

    export class KVSReader extends Reader<string, any> {

        constructor(private storage: KeyValueStorage<any>) {
        }

        read(key: string): monapt.Option<any> {
            return this.storage.get(key);
        }

    }

    export class UnserializationReader extends Reader<number, string> {

        private data: string[];

        constructor(serialized: string, delimiter: string) {
            this.data = serialized ? serialized.split(delimiter) : [];
        }

        read(key: number): monapt.Option<string> {
            var value = this.data[key];
            if (typeof value !== 'undefined') {
                return new monapt.Some(value);
            } else {
                return new monapt.None<string>();
            }
        }

        readString(key: number): monapt.Option<string> {
            return this.read(key).map(v => unescape(v.toString()));
        }

    }

}
