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
                if (value === null) {
                    value = '';
                } else {
                    value = String(value);
                }
            }
            return value;
        }

        setString(key: string, value: string): void {
            if (typeof value === 'undefined' || value === null) {
                value = '';
            }
            this.storage.set(key, String(value));
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
            if (typeof value !== 'number') {
                value = parseInt(<any>value) || 0;
            }
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

    export class UpdateTimeStorage {

        private storage: TypedStorage;
        private lastUpdateTime: number;

        constructor(storage: IStorage, private key: string) {
            this.storage = new TypedStorage(storage);
        }

        isChanged(): boolean {
            return (this.lastUpdateTime !== this.getLastUpdateTime());
        }

        fetch(): void {
            this.lastUpdateTime = this.getLastUpdateTime();
        }

        update(): void {
            this.updateLastUpdateTime();
        }

        private getLastUpdateTime(): number {
            return this.storage.getInteger(this.key);
        }

        private updateLastUpdateTime(): void {
            this.lastUpdateTime = (new Date()).getTime();
            this.storage.setInteger(this.key, this.lastUpdateTime);
        }

    }

}
