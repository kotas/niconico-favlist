/// <reference path="../../../typings/greasemonkey.d.ts" />
/// <reference path="../../../vendor/monapt/monapt.ts" />

module util {

    export interface UrlFetchOption {
        url: string;
        method: string;
        headers?: Object;
        timeout?: number;
    }

    export interface UrlFetchResponse {
        responseHeaders: string;
        responseText: string;
        status: number;
        statusText: string;
    }

    export interface UrlFetcher {
        fetch(option: UrlFetchOption): monapt.Future<UrlFetchResponse>;
    }

    export class UrlFetcherGM implements UrlFetcher {

        fetch(option: UrlFetchOption): monapt.Future<UrlFetchResponse> {
            return monapt.Future<UrlFetchResponse>(promise => {
                GM_xmlhttpRequest({
                    url: option.url,
                    method: option.method,
                    headers: option.headers,
                    timeout: option.timeout,
                    onload: (response: GMXMLHttpRequestResponse) => {
                        promise.success(response);
                    },
                    onerror: () => {
                        promise.failure(new Error('Failed to fetch URL'));
                    },
                    ontimeout: () => {
                        promise.failure(new Error('Failed to fetch URL: timed out'));
                    }
                });
            });
        }

    }

    export class UrlFetcherXHR implements UrlFetcher {

        fetch(option: UrlFetchOption): monapt.Future<UrlFetchResponse> {
            return monapt.Future<UrlFetchResponse>(promise => {
                var req = new XMLHttpRequest();
                req.open(option.method, option.url, true);

                req.onload = () => {
                    promise.success({
                        responseHeaders: req.getAllResponseHeaders(),
                        responseText:    req.responseText,
                        status:          req.status,
                        statusText:      req.statusText
                    });
                };

                req.onerror = () => {
                    promise.failure(new Error('Failed to fetch URL'));
                };

                req.ontimeout = () => {
                    promise.failure(new Error('Failed to fetch URL: timed out'));
                };

                if (option.headers) {
                    for (var key in option.headers) {
                        if (option.headers.hasOwnProperty(key)) {
                            req.setRequestHeader(key, option.headers[key]);
                        }
                    }
                }

                req.send(null);
                return req;
            });
        }

    }

}
