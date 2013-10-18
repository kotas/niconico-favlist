/// <reference path="../storage/kvs/key_value_storage.ts" />

// We have to use escape/unescape for backward compatibility
declare function escape(s: string): string;

module util {

    export class Writer<K> {

        write(key: K, value: string): void {
            throw new Error('Not implemented');
        }

        writeString(key: K, value: string): void {
            this.write(key, value);
        }

        writeInteger(key: K, value: number): void {
            this.write(key, value.toString());
        }

        writeBoolean(key: K, value: boolean): void {
            this.write(key, value ? '1' : '0');
        }

    }

    export class KVSWriter extends Writer<string> {

        constructor(private storage: KeyValueStorage) {
        }

        write(key: string, value: string): void {
            this.storage.set(key, value);
        }

    }

    export class SerializationWriter extends Writer<number> {

        private data: string[] = [];

        constructor(private delimiter: string) {
        }

        write(key: number, value: string): void {
            this.data[key] = value;
        }

        writeString(key: number, value: string): void {
            this.write(key, escape(value));
        }

        toString(): string {
            return this.data.join(this.delimiter);
        }

    }

}
