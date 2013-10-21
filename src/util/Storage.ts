/// <reference path="../../typings/greasemonkey.d.ts" />

module util {

    export interface IStorage {
        get(key: string, defaultValue?: any): any;
        set(key: string, value: any): void;
    }

    export function chooseStorage(): IStorage {
        if (GMStorage.isAvailable()) {
            return new GMStorage();
        } else if (LocalStorage.isAvailable()) {
            return new LocalStorage();
        } else {
            throw new Error('No supported storage');
        }
    }

    export class GMStorage implements IStorage {

        static isAvailable(): boolean {
            return (typeof GM_getValue !== 'undefined' && GM_getValue.toString().indexOf('not supported') === -1);
        }

        get(key: string, defaultValue?: any): any {
            return GM_getValue(key, defaultValue);
        }

        set(key: string, value: any): void {
            GM_setValue(key, value);
        }

    }

    export class LocalStorage implements IStorage {

        static isAvailable(): boolean {
            return (typeof window.localStorage !== 'undefined');
        }

        get(key: string, defaultValue?: any): any {
            var value = window.localStorage[key];
            return (typeof value !== 'undefined') ? value : defaultValue;
        }

        set(key: string, value: any): void {
            window.localStorage[key] = value;
        }

    }

    export class TypedStorage implements IStorage {

        constructor(private storage: IStorage) {}

        get(key: string, defaultValue?: any): any {
            return this.storage.get(key, defaultValue);
        }

        set(key: string, value: any): void {
            this.storage.set(key, value);
        }

        getString(key: string, defaultValue?: string): string {
            var value = this.storage.get(key, defaultValue);
            if (typeof value !== 'undefined') {
                value = String(value);
            }
            return value;
        }

        setString(key: string, value: string): void {
            this.storage.set(key, value);
        }

        getInteger(key: string, defaultValue?: number): number {
            var value = this.storage.get(key);
            if (typeof value !== 'undefined') {
                var num = parseInt(String(value), 10);
                return isNaN(num) ? defaultValue : num;
            } else {
                return defaultValue;
            }
        }

        setInteger(key: string, value: number): void {
            this.storage.set(key, value.toString());
        }

        getBoolean(key: string, defaultValue?: boolean): boolean {
            var value = this.storage.get(key);
            if (typeof value !== 'undefined') {
                return (String(value) !== '0');
            } else {
                return defaultValue;
            }
        }

        setBoolean(key: string, value: boolean): void {
            this.storage.set(key, value ? '1' : '0');
        }

    }

}
