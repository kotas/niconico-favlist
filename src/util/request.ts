/// <reference path="../../typings/greasemonkey.d.ts" />

module util {

    export function request(options: GMXMLHttpRequestOptions): any {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            return GM_xmlhttpRequest(options);
        }

        var req = new XMLHttpRequest();
        req.open(options.method, options.url, true);

        ['onabort', 'onload', 'onreadystatechange', 'ontimeout', 'onprogress'].forEach(function (name) {
            if (options.hasOwnProperty(name)) {
                if (name === 'onprogress') {
                    req[name] = (ev: ProgressEvent) => options[name](createProgressResponse(req, options, ev));
                } else {
                    req[name] = () => options[name](createResponse(req, options));
                }
            }
        });

        if (options.overrideMimeType) {
            req.overrideMimeType(options.overrideMimeType);
        }
        if (options.headers) {
            for (var key in options.headers) {
                if (options.headers.hasOwnProperty(key)) {
                    req.setRequestHeader(key, options.headers[key]);
                }
            }
        }

        req.send(options.data || null);
        return req;
    }

    function createResponse(req: XMLHttpRequest, options: GMXMLHttpRequestOptions): GMXMLHttpRequestResponse {
        return {
            readyState: req.readyState,
            responseHeaders: req.getAllResponseHeaders(),
            responseText: req.responseText,
            status: req.status,
            statusText: req.statusText,
            context: options.context,
            finalUrl: options.url
        };
    }

    function createProgressResponse(req: XMLHttpRequest, options: GMXMLHttpRequestOptions,
                                    event: ProgressEvent): GMXMLHttpRequestProgressResponse {
        var response = <GMXMLHttpRequestProgressResponse> createResponse(req, options);
        response.lengthComputable = event.lengthComputable;
        response.loaded = event.loaded;
        response.total = event.total;
        return response;
    }

}
