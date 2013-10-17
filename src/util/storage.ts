/// <reference path="../../typings/greasemonkey.d.ts" />

module util {

    export interface Storage {
        get(key: string, defaultValue?: any): any;
        set(key: string, value: any): void;
        getString(key: string, defaultValue?: string): string;
        setString(key: string, value: string): void;
        getInteger(key: string, defaultValue?: number): number;
        setInteger(key: string, value: number): void;
        getBoolean(key: string, defaultValue?: boolean): boolean;
        setBoolean(key: string, value: boolean): void;
    }

    export var Storage: Storage = (() => {
        var _get = (typeof GM_getValue !== 'undefined') ? GM_getValue : shimGetValue;
        var _set = (typeof GM_setValue !== 'undefined') ? GM_setValue : shimSetValue;

        return {
            get: _get,
            set: _set,

            getString: (key: string, defaultValue?: string): string => {
                var value = _get(key, defaultValue);
                if (typeof value !== 'undefined') {
                    value = String(value);
                }
                return value;
            },
            setString: (key: string, value: string): void => {
                _set(key, value);
            },

            getInteger: (key: string, defaultValue?: number): number => {
                var value = _get(key, defaultValue);
                if (typeof value !== 'undefined') {
                    if (isNaN(value = parseInt(value, 10))) {
                        value = defaultValue;
                    }
                }
                return value;
            },
            setInteger: (key: string, value: number): void => {
                _set(key, value.toString());
            },

            getBoolean: (key: string, defaultValue?: boolean): boolean => {
                var value = _get(key, defaultValue);
                if (typeof value !== 'undefined') {
                    value = (value !== '0');
                }
                return value;
            },
            setBoolean: (key: string, value: boolean): void => {
                _set(key, value ? '1' : '0');
            }
        };


        function shimGetValue(key: string, defaultValue?: any): any {
            if (key in window.localStorage) {
                return window.localStorage[key];
            } else {
                return defaultValue;
            }
        }

        function shimSetValue(key: string, value: any): void {
            window.localStorage[key] = value;
        }
    })();

}
