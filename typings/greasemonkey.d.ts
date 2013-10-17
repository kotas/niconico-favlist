/**
 * TypeScript Definition for Greasemonkey userscript
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Kota Saito <kotas@kotas.jp>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

declare var unsafeWindow: Window;

declare var GM_info: {
    script: {
        description: string;
        excludes: string[];
        includes: string[];
        matches: string[];
        name: string;
        namespace: string;
        resources: Object;
        "run-at": string;
        unwrap: boolean;
    };
    scriptMetaStr: string;
    scriptWillUpdate: boolean;
    version: string;
};

declare function GM_deleteValue(name: string): void;
declare function GM_getValue(name: string, defaultValue?: any): any;
declare function GM_listValues(): Object;
declare function GM_setValue(name: string, value: any): void;

declare function GM_getResourceText(resourceName: string): string;
declare function GM_getResourceURL(resourceName: string): string;

declare function GM_addStyle(css: string): void;
declare function GM_log(message: any): void;
declare function GM_openInTab(url: string): Window;
declare function GM_registerMenuCommand(caption: string, commandFunc: Function, accessKey?: string): void;
declare function GM_setClipboard(text: string): void;

interface GMXMLHttpRequestResponse {
    readyState: number;
    responseHeaders: string;
    responseText: string;
    status: number;
    statusText: string;
    context: Object;
    finalUrl: string;
}

interface GMXMLHttpRequestProgressResponse extends GMXMLHttpRequestResponse {
    lengthComputable: boolean;
    loaded: number;
    total: number;
}

interface GMXMLHttpRequestOptions {
    binary?: boolean;
    context?: Object;
    data?: string;
    headers?: Object;
    method: string;
    onabort?: (response: GMXMLHttpRequestResponse) => any;
    onerror?: (response: GMXMLHttpRequestResponse) => any;
    onload?: (response: GMXMLHttpRequestResponse) => any;
    onprogress?: (response: GMXMLHttpRequestProgressResponse) => any;
    onreadystatechange?: (response: GMXMLHttpRequestResponse) => any;
    ontimeout?: (response: GMXMLHttpRequestResponse) => any;
    overrideMimeType?: string;
    password?: string;
    synchronous?: boolean;
    timeout?: number;
    upload?: {
        onabort?: (response: GMXMLHttpRequestResponse) => any;
        onerror?: (response: GMXMLHttpRequestResponse) => any;
        onload?: (response: GMXMLHttpRequestResponse) => any;
        onprogress?: (response: GMXMLHttpRequestProgressResponse) => any;
    };
    url: string;
    user?: string;
}

declare function GM_xmlhttpRequest(options: GMXMLHttpRequestOptions): {
    abort(): void;

    // These are for synchronouse mode
    finalUrl: string;
    readyState: number;
    responseHeaders: string;
    responseText: string;
    status: number;
    statusText: string;
};
