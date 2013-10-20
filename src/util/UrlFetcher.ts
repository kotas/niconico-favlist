/// <reference path="../../typings/greasemonkey.d.ts" />

module util {

    export interface IUrlFetchOption {
        url: string;
        method: string;
        headers?: Object;
        timeout?: number;
    }

    export interface IUrlFetchResponse {
        responseHeaders: string;
        responseText: string;
        status: number;
        statusText: string;
    }

    export interface IUrlFetchAborter {
        abort: () => void;
    }

    export interface IUrlFetchCallback {
        (error: Error, response: IUrlFetchResponse): any;
    }

    export interface IUrlFetcher {

        fetch(option: IUrlFetchOption, callback: IUrlFetchCallback): IUrlFetchAborter;

    }

    export class GMUrlFetcher {

        constructor(private userAgent: string) {}

        fetch(option: IUrlFetchOption, callback: IUrlFetchCallback): IUrlFetchAborter {
            option.headers = option.headers || {};
            option.headers['User-Agent'] = this.userAgent;

            return GM_xmlhttpRequest({
                url: option.url,
                method: option.method,
                headers: option.headers,
                timeout: option.timeout,
                onload: (response: GMXMLHttpRequestResponse) => {
                    callback(null, {
                        responseHeaders: response.responseHeaders,
                        responseText:    response.responseText,
                        status:          response.status,
                        statusText:      response.statusText
                    });
                },
                onerror: () => {
                    callback(new Error('Failed to fetch URL'), null);
                },
                ontimeout: () => {
                    callback(new Error('Failed to fetch URL by time out'), null);
                },
                onabort: () => {
                    callback(new Error('Aborted'), null);
                }
            });
        }

    }

    export class XHRUrlFetcher {

        constructor(private userAgent: string) {}

        fetch(option: IUrlFetchOption, callback: IUrlFetchCallback): IUrlFetchAborter {
            var req = new XMLHttpRequest();
            req.open(option.method, option.url, true);

            req.onload = () => {
                callback(null, {
                    responseHeaders: req.getAllResponseHeaders(),
                    responseText:    req.responseText,
                    status:          req.status,
                    statusText:      req.statusText
                });
            };
            req.onerror = () => {
                callback(new Error('Failed to fetch URL'), null);
            };
            req.ontimeout = () => {
                callback(new Error('Failed to fetch URL by time out'), null);
            };
            req.onabort = () => {
                callback(new Error('Aborted'), null);
            };

            if (option.headers) {
                for (var key in option.headers) {
                    if (option.headers.hasOwnProperty(key)) {
                        req.setRequestHeader(key, option.headers[key]);
                    }
                }
            }
            if (option.timeout) {
                req.timeout = option.timeout;
            }

            req.setRequestHeader('User-Agent', this.userAgent);
            req.send(null);
            return { abort: () => { req.abort(); } };
        }

    }

}
