// ==UserScript==
// @name           NicoNicoFavlist
// @version        1.3.0
// @author         Kota Saito <kotas.nico@gmail.com>
// @copyright      2007-2013 Kota Saito
// @description    Get your favorite mylists checked twenty-four-seven!
// @namespace      http://www.nicovideo.jp/
// @include        http://www.nicovideo.jp/
// @include        http://www.nicovideo.jp/?*
// @include        http://www.nicovideo.jp/mylist/*
// @include        http://www.nicovideo.jp/user/*
// @include        http://www.nicovideo.jp/video_top*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_info
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL    https://raw.github.com/kotas/niconico-favlist/latest/dist/niconicofavlist.user.js
// @updateURL      https://raw.github.com/kotas/niconico-favlist/latest/dist/niconicofavlist.meta.js
// ==/UserScript==

(function ($) {

var Template = { html: {}, css: {} };
Template.html['favlist'] = "<div class=\"favlistView\">\n<div class=\"favlistHeader\">\n<div class=\"favlistHeaderTitle\">favlist</div>\n<a href=\"#\" class=\"favlistSettingButton\">設定</a>\n</div>\n<div class=\"favlistPages\">\n</div>\n</div>";
Template.html['favlist_mylists'] = "<div class=\"favlistMylistsView\">\n<div class=\"favlistNoMylist\">\n<div class=\"favlistNoMylistTitle\">マイリストが登録されていません</div>\n<div class=\"favlistNoMylistDescription\">チェックしたいマイリストのページで「favlist に登録」してください！</div>\n</div>\n<div class=\"favlistMylists\">\n</div>\n<div class=\"favlistButtons\">\n<button class=\"favlistCheckNowButton\">今すぐ更新</button>\n</div>\n</div>";
Template.html['favlist_mylists_mylist'] = "<div class=\"favlistMylist\">\n<div class=\"favlistMylistInner\">\n<div class=\"favlistMylistHeader\">\n<div class=\"favlistMylistTitleLabel\">\n<span class=\"favlistMylistNewCountLabel\">\n(<span class=\"favlistMylistNewCount\"></span>)\n</span>\n<a href=\"#\" class=\"favlistMylistTitle favlistMylistLink\"></a>\n</div>\n<div class=\"favlistMylistButtons\">\n<button class=\"favlistMylistClearButton\">クリア</button>\n</div>\n<div class=\"favlistMylistStatus\">\n<span class=\"waiting\">待機中</span>\n<span class=\"updating\">更新中</span>\n<span class=\"private\">非公開</span>\n<span class=\"failed\">更新失敗</span>\n</div>\n</div>\n<div class=\"favlistMylistVideos\">\n</div>\n</div>\n</div>";
Template.html['favlist_mylists_video'] = "<div class=\"favlistVideo\">\n<div class=\"favlistVideoHeader\">\n<div class=\"favlistVideoThumbnail\">\n<a href=\"\" title=\"\" class=\"favlistVideoLink\"><img src=\"\" /></a>\n</div>\n<div class=\"favlistVideoInfo\">\n<a href=\"\" title=\"\" class=\"favlistVideoLink favlistVideoTitle\"></a>\n<span class=\"favlistVideoTimestamp\"></span>\n</div>\n</div>\n<div class=\"favlistVideoMemo\">\n<div class=\"favlistVideoMemoText\"></div>\n</div>\n</div>";
Template.html['favlist_rescue'] = "<div class=\"favlistViewRescue\">\n<div class=\"favlistRescueCaption\">\nレスキューモードで実行中 (\n<a href=\"#\" class=\"favlistRescueClose\">Favlist を閉じる</a>\n<a href=\"#\" class=\"favlistRescueOpen\">Favlist を開く</a>\n)\n</div>\n<div id=\"favlistRescueContainer\"></div>\n</div>";
Template.html['favlist_settings'] = "<div class=\"favlistSettingsView\">\n<div class=\"favlistSettingMylists\">\n</div>\n<form class=\"favlistConfig\" action=\"javascript:void(0);\">\n<ul class=\"favlistConfigItems\">\n<li><label>更新チェック間隔 <input type=\"text\" class=\"favlistConfigText favlistConfigCheckInterval\" value=\"\" size=\"6\" /> 秒</label></li>\n<li><label>新着動画の表示数 <input type=\"text\" class=\"favlistConfigText favlistConfigMaxNewVideos\" value=\"\" size=\"6\" /> 件まで</label></li>\n<li><label><input type=\"checkbox\" class=\"favlistConfigCheckbox favlistConfigHideCheckedList\" value=\"1\" /> 新着がないマイリストを隠す</label></li>\n<li><label><input type=\"checkbox\" class=\"favlistConfigCheckbox favlistConfigOrderDescendant\" value=\"1\" /> 動画を新しい順に並べる</label></li>\n</ul>\n<div class=\"favlistButtons\">\n<button class=\"favlistButtonSave favlistSaveSettingsButton\">設定を保存</button>\n<button class=\"favlistCancelSettingsButton\">キャンセル</button>\n</div>\n</form>\n</div>";
Template.html['favlist_settings_mylist'] = "<div class=\"favlistSettingMylist\">\n<div class=\"favlistSettingMylistTitle\">\n<input class=\"favlistMylistTitleEdit\" type=\"text\" value=\"\" />\n</div>\n<div class=\"favlistSettingMylistButtons\">\n<button class=\"favlistMylistMoveUpButton\" title=\"1つ上に移動\">▲</button>\n<button class=\"favlistMylistMoveDownButton\" title=\"1つ下に移動\">▼</button>\n<button class=\"favlistMylistMoveTopButton\" title=\"一番上に移動\">↑</button>\n<button class=\"favlistMylistRemoveButton\" title=\"favlist への登録を解除\">削除</button>\n</div>\n</div>";
Template.html['subscribe'] = "<div class=\"favlistSubscribeView\">\n<button class=\"favlistSubscribeButton\"><span>★</span> favlist に登録</button>\n<button class=\"favlistUnsubscribeButton\"><span>×</span> favlist の登録を解除</button>\n</div>";
Template.html['subscribe_rescue'] = "<div id=\"favlistSubscribeViewRescue\">\n</div>";
Template.css['favlist'] = ".favlistView {\nbackground: white;\nfont-size: 12px;\nline-height: 1.2em;\nmargin-bottom: 8px;\nborder-radius: 2px;\nbox-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);\nposition: relative;\nwidth: 100%;\n}\n.favlistHeader {\ndisplay: table;\nwidth: 100%;\nheight: 30px;\n}\n.favlistHeaderTitle {\ndisplay: table-cell;\npadding: 5px 10px;\nbackground: #ccc;\ncolor: #333;\nfont-size: 13px;\nfont-weight: bold;\nvertical-align: middle;\n}\n.favlistSettingButton {\ndisplay: table-cell;\nbackground: #336666;\nwidth: 4em;\ntext-align: center;\ncolor: #ffffff !important;\ntext-decoration: none;\nwhite-space: nowrap;\nvertical-align: middle;\n}\n.favlistSettingButton:hover {\nbackground: #669999;\ntext-decoration: underline;\n}\n.inSettingView .favlistSettingButton {\ndisplay: none;\n}\n.favlistPages {\npadding: 10px;\nposition: relative;\n}\n.favlistButtons button {\nmargin-right: 4px;\n}\na.favlistMylistLink, a.favlistMylistLink:link,\na.favlistVideoLink, a.favlistVideoLink:link {\ncolor: #006699 !important;\n}\na.favlistMylistLink:visited, a.favlistVideoLink:visited {\ncolor: #005584 !important;\n}\na.favlistMylistLink:hover, a.favlistVideoLink:hover {\ncolor: #0584C3 !important;\n}\na.favlistMylistLink:active, a.favlistVideoLink:active {\ncolor: #52aeea !important;\n}\n.favlistView button {\ndisplay: inline-block;\npadding: 2px 10px;\nbackground: #666666;\nfont-family: sans-serif;\ncolor: white;\nborder: none;\nborder-radius: 4px;\nwhite-space: nowrap;\n}\n.favlistView button.disabled,\n.favlistView button[disabled] {\ncursor: not-allowed;\npointer-events: none;\nopacity: .2;\n}\n.favlistView button:hover {\nbackground: #777777;\n}\n.favlistView button:active {\nbackground: #555555;\n}\n.favlistView button.favlistButtonSave {\nbackground: #339933;\n}\n.favlistView button.favlistButtonSave:hover {\nbackground: #55BB55;\n}\n.favlistView button.favlistButtonSave:hover {\nbackground: #228822;\n}";
Template.css['favlist_mylists'] = ".favlistNoMylist {\ndisplay: none;\n}\n.noMylist .favlistNoMylist {\ndisplay: block;\n}\n.favlistNoMylistTitle {\npadding: 30px;\ntext-align: center;\ncolor: #cccccc;\n}\n.noMylist .favlistMylists {\ndisplay: none;\n}\n.noMylist .favlistButtons {\ndisplay: none;\n}";
Template.css['favlist_mylists_mylist'] = ".favlistMylistInner {\nmargin-bottom: 8px;\npadding-bottom: 8px;\nborder-bottom: 1px solid #eeeeee;\n}\n.checkedMylistHidden .favlistMylistInner {\ndisplay: none;\n}\n.checkedMylistHidden .hasNewVideo .favlistMylistInner,\n.checkedMylistHidden .hasStatus .favlistMylistInner {\ndisplay: block;\n}\n.favlistMylistHeader {\ndisplay: table;\nwidth: 100%;\n}\n.favlistMylistTitleLabel {\ndisplay: table-cell;\nwidth: 100%;\nmax-width: 1px;\noverflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap;\nvertical-align: middle;\n}\n.favlistMylist.hasNewVideo .favlistMylistTitleLabel {\nfont-weight: bold;\n}\n.favlistMylistNewCountLabel {\ndisplay: none;\ncolor: #C00;\nwhite-space: nowrap;\n}\n.favlistMylist.hasNewVideo .favlistMylistNewCountLabel {\ndisplay: inline;\n}\n.favlistMylistButtons {\ndisplay: table-cell;\npadding-left: 8px;\n}\n.favlistMylistButtons button {\nfont-size: 10px;\n}\n.favlistMylist.hasStatus .favlistMylistButtons {\ndisplay: none;\n}\n.favlistMylistStatus {\ndisplay: none;\n}\n.favlistMylist.hasStatus .favlistMylistStatus {\ndisplay: table-cell;\npadding-left: 8px;\n}\n.favlistMylistStatus span {\ndisplay: inline-block;\npadding: 2px 10px;\nborder-radius: 10px;\nbackground: black;\nfont-size: 10px;\ncolor: white;\nwhite-space: nowrap;\n}\n.favlistMylistStatus span.waiting {\ncolor: #999;\nbackground: #efefef;\n}\n.favlistMylistStatus span.updating {\nbackground: #36689d;\n}\n.favlistMylistStatus span.private,\n.favlistMylistStatus span.failed {\nbackground: #900;\n}";
Template.css['favlist_mylists_video'] = ".favlistVideo {\nmargin: 8px 4px 0;\n}\n.favlistVideoHeader {\ndisplay: table;\nwidth: 100%;\n}\n.favlistVideoThumbnail {\ndisplay: table-cell;\nvertical-align: middle;\npadding-right: 8px;\n}\n.favlistVideoThumbnail a img {\nborder: none;\nwidth: 46px;\nheight: 34px;\n}\n.favlistVideoInfo {\ndisplay: table-cell;\nvertical-align: middle;\nwidth: 100%;\nfont-size: 11px;\n}\n.favlistVideoTitle {\nmargin-right: 4px;\n}\n.favlistVideoTimestamp {\nfont-size: 9px;\ncolor: #999;\nwhite-space: nowrap;\n}\n.favlistVideoMemo {\nmargin-top: 4px;\npadding: 4px 8px;\nborder-radius: 2px;\nbackground: #efefef;\nbox-shadow: 1px 1px 1px #ccc;\ncursor: pointer;\n}\n.favlistVideoMemo:hover {\nbackground: #f3f3f3;\n}\n.favlistVideoMemoText {\ndisplay: block;\nmax-height: 28px;\noverflow: hidden;\nfont-size: 10px;\n}\n.favlistVideoMemo.expanded .favlistVideoMemoText {\nwhite-space: pre;\nmax-height: none;\n}";
Template.css['favlist_rescue'] = ".favlistViewRescue {\nposition: fixed;\nwidth: 360px;\nheight: 360px;\nright: 10px;\nbottom: 10px;\noverflow: auto;\nbackground-color: white;\nborder: 1px solid #cccccc;\n}\n.favlistRescueCaption {\nfont-size: 12px;\ncolor: #cc0000;\n}\n.favlistRescueOpen,\n.favlistViewRescue.closed .favlistRescueClose {\ndisplay: none;\n}\n.favlistViewRescue.closed .favlistRescueOpen {\ndisplay: inline;\n}";
Template.css['favlist_settings'] = ".favlistConfigItems {\nlist-style-type: none;\n}\n.favlistConfigItems li {\nmargin-bottom: 10px;\n}\n.favlistConfigItems li label {\ncolor: #333;\n}\n.favlistConfigItems .favlistConfigText {\nmargin-left: 10px;\n}";
Template.css['favlist_settings_mylist'] = ".favlistSettingMylist {\nmargin-bottom: 8px;\npadding-bottom: 8px;\nborder-bottom: 1px solid #eeeeee;\n}\n.favlistSettingMylistTitle {\nposition: relative;\nmargin-bottom: 4px;\n}\n.favlistMylistTitleEdit {\nwidth: 98%;\n}\n.favlistSettingMylistButtons button {\npadding: 0px 10px;\nfont-size: 10px;\n}\n.favlistMylistRemoveButton {\nfloat: right;\n}";
Template.css['subscribe'] = ".favlistSubscribeView {\ndisplay: inline-block;\n}\n.favlistSubscribeView,\n.favlistSubscribeView.subscribed .favlistUnsubscribeButton {\ndisplay: inline-block;\n}\n.favlistSubscribeView.subscribed .favlistSubscribeButton,\n.favlistUnsubscribeButton {\ndisplay: none;\n}\n.favlistSubscribeView button {\npadding: 4px 10px;\ncolor: white;\nborder: none;\nborder-radius: 4px;\nwhite-space: nowrap;\nfont-size: 12px;\ntext-decoration: none;\ntext-align: center;\nbackground: #435d69;\n}\n.favlistSubscribeView button:hover {\nbackground: #4f6d7b;\n}\n.favlistSubscribeView button:active {\nbackground: #3d5560;\n}\n.favlistSubscribeButton span {\ncolor: #fc3;\n}\n.favlistUnsubscribeButton span {\ncolor: #ff6462;\n}";
Template.css['subscribe_rescue'] = "#favlistSubscribeViewRescue {\nposition: fixed;\nleft: 10px;\nbottom: 10px;\npadding: 4px;\nbackground: #ccc;\nborder-radius: 4px;\n}";
var util;
(function (util) {
    function chooseStorage() {
        if (GMStorage.isAvailable()) {
            return new GMStorage();
        } else if (LocalStorage.isAvailable()) {
            return new LocalStorage();
        } else {
            throw new Error('No supported storage');
        }
    }
    util.chooseStorage = chooseStorage;

    var GMStorage = (function () {
        function GMStorage() {
        }
        GMStorage.isAvailable = function () {
            return (typeof GM_getValue !== 'undefined' && GM_getValue.toString().indexOf('not supported') === -1);
        };

        GMStorage.prototype.get = function (key, defaultValue) {
            return GM_getValue(key, defaultValue);
        };

        GMStorage.prototype.set = function (key, value) {
            GM_setValue(key, value);
        };
        return GMStorage;
    })();
    util.GMStorage = GMStorage;

    var LocalStorage = (function () {
        function LocalStorage() {
        }
        LocalStorage.isAvailable = function () {
            return (typeof window.localStorage !== 'undefined');
        };

        LocalStorage.prototype.get = function (key, defaultValue) {
            var value = window.localStorage[key];
            return (typeof value !== 'undefined') ? value : defaultValue;
        };

        LocalStorage.prototype.set = function (key, value) {
            window.localStorage[key] = value;
        };
        return LocalStorage;
    })();
    util.LocalStorage = LocalStorage;

    var TypedStorage = (function () {
        function TypedStorage(storage) {
            this.storage = storage;
        }
        TypedStorage.prototype.get = function (key, defaultValue) {
            return this.storage.get(key, defaultValue);
        };

        TypedStorage.prototype.set = function (key, value) {
            this.storage.set(key, value);
        };

        TypedStorage.prototype.getString = function (key, defaultValue) {
            var value = this.storage.get(key, defaultValue);
            if (typeof value !== 'undefined') {
                value = String(value);
            }
            return value;
        };

        TypedStorage.prototype.setString = function (key, value) {
            this.storage.set(key, value);
        };

        TypedStorage.prototype.getInteger = function (key, defaultValue) {
            var value = this.storage.get(key);
            if (typeof value !== 'undefined') {
                var num = parseInt(String(value), 10);
                return isNaN(num) ? defaultValue : num;
            } else {
                return defaultValue;
            }
        };

        TypedStorage.prototype.setInteger = function (key, value) {
            this.storage.set(key, value.toString());
        };

        TypedStorage.prototype.getBoolean = function (key, defaultValue) {
            var value = this.storage.get(key);
            if (typeof value !== 'undefined') {
                return (String(value) !== '0');
            } else {
                return defaultValue;
            }
        };

        TypedStorage.prototype.setBoolean = function (key, value) {
            this.storage.set(key, value ? '1' : '0');
        };
        return TypedStorage;
    })();
    util.TypedStorage = TypedStorage;
})(util || (util = {}));
var util;
(function (util) {
    function chooseUrlFetcher() {
        if (GMUrlFetcher.isAvailable()) {
            return new GMUrlFetcher();
        } else if (XHRUrlFetcher.isAvailable()) {
            return new XHRUrlFetcher();
        } else {
            throw new Error('No supported URL fetcher');
        }
    }
    util.chooseUrlFetcher = chooseUrlFetcher;

    var GMUrlFetcher = (function () {
        function GMUrlFetcher() {
        }
        GMUrlFetcher.isAvailable = function () {
            return (typeof GM_xmlhttpRequest !== 'undefined');
        };

        GMUrlFetcher.prototype.fetch = function (option, callback) {
            return GM_xmlhttpRequest({
                url: option.url,
                method: option.method,
                headers: option.headers,
                timeout: option.timeout,
                onload: function (response) {
                    callback(null, {
                        responseHeaders: response.responseHeaders,
                        responseText: response.responseText,
                        status: response.status,
                        statusText: response.statusText
                    });
                },
                onerror: function () {
                    callback(new Error('Failed to fetch URL'), null);
                },
                ontimeout: function () {
                    callback(new Error('Failed to fetch URL by time out'), null);
                },
                onabort: function () {
                    callback(new Error('Aborted'), null);
                }
            });
        };
        return GMUrlFetcher;
    })();
    util.GMUrlFetcher = GMUrlFetcher;

    var XHRUrlFetcher = (function () {
        function XHRUrlFetcher() {
        }
        XHRUrlFetcher.isAvailable = function () {
            return (typeof XMLHttpRequest !== 'undefined');
        };

        XHRUrlFetcher.prototype.fetch = function (option, callback) {
            var req = new XMLHttpRequest();
            req.open(option.method, option.url, true);

            req.onload = function () {
                callback(null, {
                    responseHeaders: req.getAllResponseHeaders(),
                    responseText: req.responseText,
                    status: req.status,
                    statusText: req.statusText
                });
            };
            req.onerror = function () {
                callback(new Error('Failed to fetch URL'), null);
            };
            req.ontimeout = function () {
                callback(new Error('Failed to fetch URL by time out'), null);
            };
            req.onabort = function () {
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

            req.send(null);
            return { abort: function () {
                    req.abort();
                } };
        };
        return XHRUrlFetcher;
    })();
    util.XHRUrlFetcher = XHRUrlFetcher;
})(util || (util = {}));
var FavlistApp = (function () {
    function FavlistApp() {
    }
    FavlistApp.prototype.start = function () {
        try  {
            this.route();
        } catch (e) {
            console.error('[NicoNicoFavlist] Error: ' + (e.message || e));
        }
    };

    FavlistApp.prototype.route = function () {
        if (/rss=/.test(window.location.search)) {
            return;
        }

        var path = window.location.pathname;
        if (/^\/mylist|^\/user/.test(path)) {
            DI.resolve('SubscribeController').start();
        } else if (/^\/$|^\/video_top/.test(path)) {
            DI.resolve('FavlistController').start();
        }
    };
    return FavlistApp;
})();
var Config = (function () {
    function Config(checkInterval, maxNewVideos, hideCheckedList, orderDescendant) {
        if (typeof checkInterval === "undefined") { checkInterval = 30 * 60; }
        if (typeof maxNewVideos === "undefined") { maxNewVideos = 10; }
        if (typeof hideCheckedList === "undefined") { hideCheckedList = false; }
        if (typeof orderDescendant === "undefined") { orderDescendant = false; }
        this.checkInterval = checkInterval;
        this.maxNewVideos = maxNewVideos;
        this.hideCheckedList = hideCheckedList;
        this.orderDescendant = orderDescendant;
    }
    Config.prototype.update = function (config) {
        this.checkInterval = config.getCheckInterval();
        this.maxNewVideos = config.getMaxNewVideos();
        this.hideCheckedList = config.isCheckedListHidden();
        this.orderDescendant = config.isOrderDescendant();
    };

    Config.prototype.getCheckInterval = function () {
        return this.checkInterval;
    };

    Config.prototype.getMaxNewVideos = function () {
        return this.maxNewVideos;
    };

    Config.prototype.isCheckedListHidden = function () {
        return this.hideCheckedList;
    };

    Config.prototype.isOrderDescendant = function () {
        return this.orderDescendant;
    };

    Config.prototype.getUserAgent = function () {
        var s;
        if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.name && GM_info.script.version) {
            s = GM_info.script.name + '/' + GM_info.script.version + ' Greasemonkey';
        } else {
            s = 'NicoNicoFavlist';
        }
        if (typeof window.navigator !== 'undefined' && window.navigator.userAgent) {
            s += ' ' + window.navigator.userAgent;
        }
        return s;
    };
    return Config;
})();
var ConfigStorage = (function () {
    function ConfigStorage(storage) {
        this.storage = new util.TypedStorage(storage);
    }
    ConfigStorage.prototype.get = function () {
        return new Config(this.storage.getInteger('checkInterval'), this.storage.getInteger('maxNewVideos'), this.storage.getBoolean('hideCheckedList'), this.storage.getBoolean('orderDescendant'));
    };

    ConfigStorage.prototype.store = function (config) {
        this.storage.setInteger('checkInterval', config.getCheckInterval());
        this.storage.setInteger('maxNewVideos', config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
    };
    return ConfigStorage;
})();
var MylistIdType;
(function (MylistIdType) {
    MylistIdType[MylistIdType["Mylist"] = 0] = "Mylist";
    MylistIdType[MylistIdType["User"] = 1] = "User";
})(MylistIdType || (MylistIdType = {}));

var MylistId = (function () {
    function MylistId(idType, idValue) {
        this.idType = idType;
        this.idValue = idValue;
    }
    MylistId.fromURL = function (url) {
        var matches;
        if (matches = url.match(/\/mylist\/(?:\d+\/)?(\d+)/)) {
            return new MylistId(MylistIdType.Mylist, matches[1]);
        } else if (matches = url.match(/\/user\/(\d+)/)) {
            return new MylistId(MylistIdType.User, matches[1]);
        } else {
            throw new Error('Unknown URL format');
        }
    };

    MylistId.fromIdString = function (idString) {
        var matches;
        if (matches = idString.match(/^mylist\/(?:\d+\/)?(\d+)|^(\d+)$/)) {
            return new MylistId(MylistIdType.Mylist, matches[1] || matches[2]);
        } else if (matches = idString.match(/^(?:myvideo|user)\/(\d+)/)) {
            return new MylistId(MylistIdType.User, matches[1]);
        } else {
            throw new Error('Unknown ID format');
        }
    };

    MylistId.prototype.equalTo = function (other) {
        return (this.idType === other.idType && this.idValue === other.idValue);
    };

    MylistId.prototype.getIdType = function () {
        return this.idType;
    };

    MylistId.prototype.getIdValue = function () {
        return this.idValue;
    };

    MylistId.prototype.toPath = function () {
        switch (this.idType) {
            case MylistIdType.Mylist:
                return 'mylist/' + this.idValue;
            case MylistIdType.User:
                return 'user/' + this.idValue + '/video';
        }
        throw new Error('Unknown ID type');
    };

    MylistId.prototype.toString = function () {
        switch (this.idType) {
            case MylistIdType.Mylist:
                return 'mylist/' + this.idValue;
            case MylistIdType.User:
                return 'myvideo/' + this.idValue;
        }
        throw new Error('Unknown ID type');
    };
    return MylistId;
})();
var Video = (function () {
    function Video(videoId, title, url, thumbnail, memo, timestamp) {
        this.videoId = videoId;
        this.title = title;
        this.url = url;
        this.thumbnail = thumbnail;
        this.memo = memo;
        this.timestamp = timestamp;
    }
    Video.prototype.getVideoId = function () {
        return this.videoId;
    };

    Video.prototype.getTitle = function () {
        return this.title;
    };

    Video.prototype.getURL = function () {
        return this.url;
    };

    Video.prototype.getThumbnail = function () {
        return this.thumbnail;
    };

    Video.prototype.getMemo = function () {
        return this.memo;
    };

    Video.prototype.getTimestamp = function () {
        return this.timestamp;
    };
    return Video;
})();
var MylistFeedEntry = (function () {
    function MylistFeedEntry(xml) {
        this.xml = xml;
    }
    MylistFeedEntry.prototype.getTitle = function () {
        return this.scrape(/<title>(.*?)<\/title>/);
    };

    MylistFeedEntry.prototype.getURL = function () {
        return this.scrape(/<link rel="alternate" type="text\/html" href="(.+?)"\/>/);
    };

    MylistFeedEntry.prototype.getVideoId = function () {
        var matches = this.getURL().match(/watch\/([^?&#]+)/);
        return matches ? matches[1] : null;
    };

    MylistFeedEntry.prototype.getThumbnail = function () {
        return this.scrape(/<img alt=".*?" src="(.+?)"/);
    };

    MylistFeedEntry.prototype.getMemo = function () {
        return this.scrape(/<p class="nico-memo">((?:.|\n)*?)<\/p>/);
    };

    MylistFeedEntry.prototype.getTimestamp = function () {
        var published = this.scrape(/<published>(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)<\/published>/);
        return Date.parse(published);
    };

    MylistFeedEntry.prototype.scrape = function (pattern) {
        var matches = this.xml.match(pattern);
        return matches ? matches[1] : null;
    };
    return MylistFeedEntry;
})();

var MylistFeed = (function () {
    function MylistFeed(url, xml) {
        this.url = url;
        this.xml = xml;
    }
    MylistFeed.prototype.getURL = function () {
        return this.url;
    };

    MylistFeed.prototype.getTitle = function () {
        var matched = this.xml.match(/<title>(?:マイリスト )?(.+?)‐ニコニコ動画.*?<\/title>/);
        return matched ? matched[1] : '';
    };

    MylistFeed.prototype.getEntries = function () {
        var entries = [];
        var re_entry = /<entry>([\S\s]*?)<\/entry>/g;
        var matched;
        while (matched = re_entry.exec(this.xml)) {
            entries.push(new MylistFeedEntry(matched[1]));
        }
        return entries;
    };
    return MylistFeed;
})();
var Nicovideo;
(function (Nicovideo) {
    Nicovideo.BASE_URL = 'http://www.nicovideo.jp/';

    function getMylistURL(mylistId) {
        return Nicovideo.BASE_URL + mylistId.toPath();
    }
    Nicovideo.getMylistURL = getMylistURL;

    function getMylistFeedURL(mylistId) {
        return getMylistURL(mylistId) + '?rss=atom&nodescription=1&noinfo=1';
    }
    Nicovideo.getMylistFeedURL = getMylistFeedURL;
})(Nicovideo || (Nicovideo = {}));
var util;
(function (util) {
    var EventEmitter = (function () {
        function EventEmitter() {
            this.listeners = {};
            this.delegators = [];
        }
        EventEmitter.prototype.addListener = function (eventName, listener) {
            (this.listeners[eventName] || (this.listeners[eventName] = [])).push(listener);
        };

        EventEmitter.prototype.addOnceListener = function (eventName, listener) {
            (listener).once = true;
            this.addListener(eventName, listener);
        };

        EventEmitter.prototype.removeListener = function (eventName, listener) {
            if (!this.listeners[eventName]) {
                return false;
            }

            var index = this.listeners[eventName].indexOf(listener);
            if (index < 0) {
                return false;
            }

            this.listeners[eventName].splice(index, 1);
            if (this.listeners[eventName].length === 0) {
                delete this.listeners[eventName];
            }
            return true;
        };

        EventEmitter.prototype.addEventDelegator = function (delegator) {
            this.delegators.push(delegator);
        };

        EventEmitter.prototype.removeEventDelegator = function (delegator) {
            var index = this.delegators.indexOf(delegator);
            if (index >= 0) {
                this.delegators.splice(index, 1);
                return true;
            } else {
                return false;
            }
        };

        EventEmitter.prototype.emitEvent = function (eventName, args) {
            if (typeof args === "undefined") { args = []; }
            var i;
            var listeners = this.listeners[eventName];
            if (listeners) {
                for (i = listeners.length - 1; i >= 0; i--) {
                    var listener = listeners[i];
                    if ((listener).once) {
                        this.removeListener(eventName, listener);
                    }
                    listener.apply(null, args);
                }
            }
            if (this.delegators.length > 0) {
                for (i = this.delegators.length - 1; i >= 0; i--) {
                    this.delegators[i](eventName, args);
                }
            }
        };
        return EventEmitter;
    })();
    util.EventEmitter = EventEmitter;
})(util || (util = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Mylist = (function (_super) {
    __extends(Mylist, _super);
    function Mylist(mylistId, originalTitle, overrideTitle, newVideos, watchedVideoIds) {
        if (typeof originalTitle === "undefined") { originalTitle = ''; }
        if (typeof overrideTitle === "undefined") { overrideTitle = ''; }
        if (typeof newVideos === "undefined") { newVideos = []; }
        if (typeof watchedVideoIds === "undefined") { watchedVideoIds = []; }
        _super.call(this);
        this.mylistId = mylistId;
        this.originalTitle = originalTitle;
        this.overrideTitle = overrideTitle;
        this.newVideos = newVideos;
        this.watchedVideoIds = watchedVideoIds;
    }
    Mylist.prototype.getMylistId = function () {
        return this.mylistId;
    };

    Mylist.prototype.getTitle = function () {
        return this.overrideTitle || this.originalTitle;
    };

    Mylist.prototype.getOriginalTitle = function () {
        return this.originalTitle;
    };

    Mylist.prototype.getOverrideTitle = function () {
        return this.overrideTitle;
    };

    Mylist.prototype.getNewVideos = function () {
        return this.newVideos;
    };

    Mylist.prototype.getNewCount = function () {
        return this.newVideos.length;
    };

    Mylist.prototype.getWatchedVideoIds = function () {
        return this.watchedVideoIds;
    };

    Mylist.prototype.getURL = function () {
        return Nicovideo.getMylistURL(this.mylistId);
    };

    Mylist.prototype.setOriginalTitle = function (title) {
        if (this.originalTitle !== title) {
            this.originalTitle = title;
            if (!this.overrideTitle) {
                this.emitEvent('updateTitle');
            }
        }
    };

    Mylist.prototype.setOverrideTitle = function (title) {
        if (title === this.overrideTitle) {
            title = '';
        }
        if (this.overrideTitle !== title) {
            this.overrideTitle = title;
            this.emitEvent('updateTitle');
        }
    };

    Mylist.prototype.markVideoAsWatched = function (video) {
        var index = this.newVideos.indexOf(video);
        if (index >= 0) {
            this.newVideos.splice(index, 1);
            this.watchedVideoIds.push(video.getVideoId());
        }
        this.emitEvent('updateVideos');
    };

    Mylist.prototype.markAllVideosAsWatched = function () {
        var _this = this;
        this.newVideos.forEach(function (video) {
            _this.watchedVideoIds.push(video.getVideoId());
        });
        this.newVideos = [];
        this.emitEvent('updateVideos');
    };

    Mylist.prototype.updateWithFeed = function (feed) {
        if (feed.getTitle()) {
            this.setOriginalTitle(feed.getTitle());
        }
        this.updateVideos(feed.getEntries().map(function (entry) {
            return new Video(entry.getVideoId(), entry.getTitle(), entry.getURL(), entry.getThumbnail(), entry.getMemo(), entry.getTimestamp());
        }));
    };

    Mylist.prototype.updateVideos = function (videos) {
        var _this = this;
        var prevWatchedVideoIdMap = {};
        this.watchedVideoIds.forEach(function (videoId) {
            prevWatchedVideoIdMap[videoId] = true;
        });

        this.newVideos = [];
        this.watchedVideoIds = [];
        videos.forEach(function (video) {
            var videoId = video.getVideoId();
            if (prevWatchedVideoIdMap.hasOwnProperty(videoId)) {
                _this.watchedVideoIds.push(videoId);
            } else {
                _this.newVideos.push(video);
            }
        });

        this.emitEvent('updateVideos');
    };
    return Mylist;
})(util.EventEmitter);
var MylistCollection = (function (_super) {
    __extends(MylistCollection, _super);
    function MylistCollection(mylists) {
        _super.call(this);
        this.mylists = mylists;
    }
    MylistCollection.prototype.getMylists = function () {
        return this.mylists;
    };

    MylistCollection.prototype.isEmpty = function () {
        return this.mylists.length === 0;
    };

    MylistCollection.prototype.get = function (mylistId) {
        var index = this.indexOfId(mylistId);
        return index >= 0 ? this.mylists[index] : null;
    };

    MylistCollection.prototype.contains = function (mylistId) {
        var index = this.indexOfId(mylistId);
        return (index >= 0);
    };

    MylistCollection.prototype.setMylists = function (mylists) {
        this.mylists = Array.prototype.slice.call(mylists);
        this.emitEvent('update');
    };

    MylistCollection.prototype.add = function (mylist) {
        this.mylists.push(mylist);
        this.emitEvent('addMylist', [mylist]);
        this.emitEvent('update');
    };

    MylistCollection.prototype.remove = function (mylist) {
        return this.removeById(mylist.getMylistId());
    };

    MylistCollection.prototype.removeById = function (mylistId) {
        var index = this.indexOfId(mylistId);
        if (index < 0) {
            return false;
        }

        var mylist = this.mylists[index];
        this.mylists.splice(index, 1);
        this.emitEvent('removeMylist', [mylist]);
        this.emitEvent('update');
        return true;
    };

    MylistCollection.prototype.indexOfId = function (mylistId) {
        for (var i = 0, l = this.mylists.length; i < l; i++) {
            if (this.mylists[i].getMylistId().equalTo(mylistId)) {
                return i;
            }
        }
        return -1;
    };
    return MylistCollection;
})(util.EventEmitter);
var MylistCollectionStorage = (function () {
    function MylistCollectionStorage(storage) {
        this.storage = storage;
    }
    MylistCollectionStorage.prototype.get = function () {
        var mylists = this.unserializeMylists(this.storage.get('favlist'));
        return new MylistCollection(mylists);
    };

    MylistCollectionStorage.prototype.store = function (mylistCollection) {
        this.storage.set('favlist', this.serializeMylists(mylistCollection.getMylists()));
    };

    MylistCollectionStorage.prototype.unserializeMylists = function (serialized) {
        var _this = this;
        return serialized ? serialized.split('#').map(function (s) {
            return _this.unserializeMylist(s);
        }) : [];
    };

    MylistCollectionStorage.prototype.serializeMylists = function (mylists) {
        var _this = this;
        return mylists.map(function (mylist) {
            return _this.serializeMylist(mylist);
        }).join('#');
    };

    MylistCollectionStorage.prototype.unserializeMylist = function (serialized) {
        var _this = this;
        var data = serialized.split(';');

        var mylistId = MylistId.fromIdString(unescape(data[1]));
        var title = unescape(data[2]);
        var checkedVideoIds = data[3] ? data[3].split(':') : [];
        var newVideos = data[4] ? data[4].split(':').map(function (s) {
            return _this.unserializeVideo(s);
        }) : [];
        var displayTitle = unescape(data[5]);

        return new Mylist(mylistId, title, displayTitle, newVideos, checkedVideoIds);
    };

    MylistCollectionStorage.prototype.serializeMylist = function (mylist) {
        var _this = this;
        return [
            '0',
            escape(mylist.getMylistId().toString()),
            escape(mylist.getOriginalTitle() || ''),
            mylist.getWatchedVideoIds().join(':'),
            mylist.getNewVideos().map(function (video) {
                return _this.serializeVideo(video);
            }).join(':'),
            escape(mylist.getOverrideTitle() || ''),
            ''
        ].join(';');
    };

    MylistCollectionStorage.prototype.unserializeVideo = function (serialized) {
        var data = serialized.split('&');

        var videoId = unescape(data[0] || '');
        var title = unescape(data[1] || '');
        var url = unescape(data[2] || '');
        var thumbnail = unescape(data[3] || '');
        var memo = unescape(data[4] || '');
        var timestamp = parseInt(unescape(data[5])) || 0;

        return new Video(videoId, title, url, thumbnail, memo, timestamp);
    };

    MylistCollectionStorage.prototype.serializeVideo = function (video) {
        return [
            escape(video.getVideoId() || ''),
            escape(video.getTitle() || ''),
            escape(video.getURL() || ''),
            escape(video.getThumbnail() || ''),
            escape(video.getMemo() || ''),
            escape(video.getTimestamp().toString())
        ].join('&');
    };
    return MylistCollectionStorage;
})();
var UpdateInterval = (function () {
    function UpdateInterval(storage, config) {
        this.storage = storage;
        this.config = config;
    }
    UpdateInterval.prototype.isExpired = function () {
        var currentTime = this.getCurrentTimeInSeconds();
        var lastUpdate = this.getLastUpdateTime();
        return (lastUpdate === null || lastUpdate + this.config.getCheckInterval() < currentTime);
    };

    UpdateInterval.prototype.expire = function () {
        this.storage.set('lastUpdate', '0');
    };

    UpdateInterval.prototype.updateLastUpdateTime = function () {
        this.storage.set('lastUpdate', this.getCurrentTimeInSeconds().toString());
    };

    UpdateInterval.prototype.getLastUpdateTime = function () {
        var lastUpdate = this.storage.get('lastUpdate');
        if (typeof lastUpdate === 'undefined') {
            return null;
        } else {
            var time = parseInt(lastUpdate);
            return isNaN(time) ? null : time;
        }
    };

    UpdateInterval.prototype.getCurrentTimeInSeconds = function () {
        return Math.floor((new Date()).getTime() / 1000);
    };
    return UpdateInterval;
})();
var util;
(function (util) {
    var CustomError = (function () {
        function CustomError(name, message) {
            this.name = name;
            this.message = message;
            Error.call(this);

            if (typeof (Error).captureStackTrace === 'function') {
                (Error).captureStackTrace(this, (this).constructor || CustomError);
            }
        }
        return CustomError;
    })();
    util.CustomError = CustomError;
    (CustomError).prototype = new Error();
    (CustomError).prototype.constructor = CustomError;
})(util || (util = {}));
var MylistFeedFetchError = (function (_super) {
    __extends(MylistFeedFetchError, _super);
    function MylistFeedFetchError(message, httpStatus) {
        _super.call(this, 'MylistFeedFetchError', message);
        this.httpStatus = httpStatus;
    }
    return MylistFeedFetchError;
})(util.CustomError);

var MylistFeedFactory = (function () {
    function MylistFeedFactory(fetcher, userAgent) {
        this.fetcher = fetcher;
        this.userAgent = userAgent;
    }
    MylistFeedFactory.prototype.getFeedFromServer = function (mylistId, callback) {
        var options = {
            method: 'GET',
            url: Nicovideo.getMylistFeedURL(mylistId),
            headers: { 'User-Agent': this.userAgent }
        };
        return this.fetcher.fetch(options, function (error, response) {
            if (error) {
                callback(new MylistFeedFetchError(error.message || error), null);
                return;
            }

            if (response.status === 200) {
                callback(null, new MylistFeed(options.url, response.responseText));
            } else {
                callback(new MylistFeedFetchError('Failed to fetch URL: ' + response.statusText, response.status), null);
            }
        });
    };
    return MylistFeedFactory;
})();
var MylistCollectionUpdater = (function (_super) {
    __extends(MylistCollectionUpdater, _super);
    function MylistCollectionUpdater(updateInterval, mylistFeedFactory) {
        _super.call(this);
        this.updateInterval = updateInterval;
        this.mylistFeedFactory = mylistFeedFactory;
    }
    MylistCollectionUpdater.prototype.updateAllIfExpired = function (collection) {
        if (this.updateInterval.isExpired()) {
            return this.updateAll(collection);
        } else {
            return null;
        }
    };

    MylistCollectionUpdater.prototype.updateAll = function (collection) {
        var _this = this;
        this.updateInterval.updateLastUpdateTime();

        var mylists = Array.prototype.slice.call(collection.getMylists());
        if (mylists.length === 0) {
            return null;
        }

        var aborted = false;
        var currentAborter;
        var aborter = {
            abort: function () {
                if (currentAborter) {
                    currentAborter.abort();
                }
                if (!aborted) {
                    aborted = true;
                    _this.emitEvent('abortUpdateAll');
                }
            }
        };

        this.emitEvent('startUpdateAll');

        var updateNext = function () {
            var mylist = mylists.shift();
            if (!mylist) {
                currentAborter = null;
                _this.emitEvent('finishUpdateAll');
            }
            if (aborted) {
                return;
            }
            currentAborter = _this.updateMylist(mylist, updateNext);
        };

        updateNext();
        return aborter;
    };

    MylistCollectionUpdater.prototype.updateMylist = function (mylist, callback) {
        var _this = this;
        this.emitEvent('startUpdateMylist', [mylist]);
        return this.mylistFeedFactory.getFeedFromServer(mylist.getMylistId(), function (error, feed) {
            if (error) {
                _this.emitEvent('failedUpdateMylist', [mylist, error]);
            } else {
                mylist.updateWithFeed(feed);
                _this.emitEvent('finishUpdateMylist', [mylist]);
            }
            callback && callback(error, mylist);
        });
    };
    return MylistCollectionUpdater;
})(util.EventEmitter);
var Templates;
(function (Templates) {
    Templates[Templates["favlist"] = 0] = "favlist";
    Templates[Templates["favlist_rescue"] = 1] = "favlist_rescue";

    Templates[Templates["favlist_mylists"] = 2] = "favlist_mylists";
    Templates[Templates["favlist_mylists_mylist"] = 3] = "favlist_mylists_mylist";
    Templates[Templates["favlist_mylists_video"] = 4] = "favlist_mylists_video";

    Templates[Templates["favlist_settings"] = 5] = "favlist_settings";
    Templates[Templates["favlist_settings_mylist"] = 6] = "favlist_settings_mylist";

    Templates[Templates["subscribe"] = 7] = "subscribe";
    Templates[Templates["subscribe_rescue"] = 8] = "subscribe_rescue";
})(Templates || (Templates = {}));

var Template;
(function (Template) {
    var loadedCSS = {};

    function load(template) {
        var name = Templates[template];
        if (typeof Template.html[name] === 'undefined') {
            throw new Error('No such template');
        }

        if (typeof Template.css[name] !== 'undefined' && !loadedCSS[name]) {
            addCSS(Template.css[name]);
            loadedCSS[name] = true;
        }

        return $(Template.html[name]);
    }
    Template.load = load;

    function addCSS(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            $('<style />').attr('type', 'text/css').html(css).appendTo($('head').eq(0));
        }
    }
})(Template || (Template = {}));
var ViewHelper;
(function (ViewHelper) {
    function formatTimestamp(timestamp) {
        var t = (new Date()).getTime() - timestamp;
        if ((t = t / 60 / 1000) < 60) {
            return (t < 1 ? '1分以内' : Math.floor(t) + '分前');
        } else if ((t = t / 60) < 24) {
            return Math.floor(t) + '時間前';
        } else if ((t = t / 24) < 14) {
            return Math.floor(t) + '日前';
        } else if ((t = t / 7) < 5) {
            return Math.floor(t) + '週間前';
        } else {
            var dt = new Date(timestamp);
            return [
                zeroPad(dt.getMonth() + 1, 2),
                '/',
                zeroPad(dt.getDay(), 2),
                ' ',
                zeroPad(dt.getHours(), 2),
                ':',
                zeroPad(dt.getMinutes(), 2)
            ].join('');
        }
    }
    ViewHelper.formatTimestamp = formatTimestamp;

    function zeroPad(n, width) {
        var s = n.toString();
        if (width > s.length) {
            return (new Array(width - s.length + 1)).join('0') + s;
        } else {
            return s;
        }
    }
    ViewHelper.zeroPad = zeroPad;
})(ViewHelper || (ViewHelper = {}));
var View = (function (_super) {
    __extends(View, _super);
    function View($parent, $el) {
        _super.call(this);
        this.$parent = $parent;
        this.$el = $el;
    }
    View.prototype.show = function () {
        this.update();
        if (this.$el.parents('html').length === 0) {
            this.$el.appendTo(this.$parent);
        }
        this.$el.show();
    };

    View.prototype.update = function () {
    };
    return View;
})(util.EventEmitter);
var FavlistMylistsVideoView = (function (_super) {
    __extends(FavlistMylistsVideoView, _super);
    function FavlistMylistsVideoView($parent, video) {
        _super.call(this, $parent, Template.load(Templates.favlist_mylists_video));
        this.video = video;
        this.update();
        this.setEventHandlers();
    }
    FavlistMylistsVideoView.prototype.update = function () {
        this.$el.find('.favlistVideoLink').attr({
            href: this.video.getURL(),
            title: this.video.getTitle()
        });
        this.$el.find('.favlistVideoThumbnail img').attr('src', this.video.getThumbnail());
        this.$el.find('.favlistVideoTimestamp').text(ViewHelper.formatTimestamp(this.video.getTimestamp())).attr('title', new Date(this.video.getTimestamp()).toLocaleString());
        this.$el.find('.favlistVideoTitle').html(this.video.getTitle() || "(無題)");

        var memo = this.video.getMemo();
        if (memo) {
            this.$el.find('.favlistVideoMemoText').html(memo);
            this.$el.find('.favlistVideoMemo').show();
        } else {
            this.$el.find('.favlistVideoMemo').hide();
        }
    };

    FavlistMylistsVideoView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistVideoLink').click(function () {
            _this.emitEvent('videoWatch', [_this.video]);
        });
        this.$el.find('.favlistVideoMemo').click(function () {
            _this.$el.find('.favlistVideoMemo').toggleClass('expanded');
            return false;
        });
    };
    return FavlistMylistsVideoView;
})(View);
var FavlistMylistsMylistView = (function (_super) {
    __extends(FavlistMylistsMylistView, _super);
    function FavlistMylistsMylistView($parent, config, mylist) {
        _super.call(this, $parent, Template.load(Templates.favlist_mylists_mylist));
        this.config = config;
        this.mylist = mylist;
        this.videoViews = [];
        this.$videos = this.$el.find('.favlistMylistVideos');
        this.update();
        this.setEventHandlers();
    }
    FavlistMylistsMylistView.prototype.showStatus = function (status, dismiss) {
        if (typeof dismiss === "undefined") { dismiss = false; }
        var _this = this;
        if (this.dismissStatusTimer) {
            clearTimeout(this.dismissStatusTimer);
            this.dismissStatusTimer = null;
        }

        this.$el.find('.favlistMylistStatus span').hide();
        this.$el.find('.favlistMylistStatus span.' + status).show();
        this.$el.addClass('hasStatus');
        if (dismiss) {
            this.dismissStatusTimer = setTimeout(function () {
                _this.dismissStatusTimer = null;
                _this.hideStatus();
            }, 3000);
        }
    };

    FavlistMylistsMylistView.prototype.hideStatus = function () {
        this.$el.removeClass('hasStatus');
        this.$el.find('.favlistMylistStatus span').hide();
    };

    FavlistMylistsMylistView.prototype.update = function () {
        this.$el.find('.favlistMylistLink').attr('href', this.mylist.getURL());
        this.updateTitle();
        this.updateVideos();
    };

    FavlistMylistsMylistView.prototype.updateTitle = function () {
        this.$el.find('.favlistMylistTitle').text(this.mylist.getTitle() || "(無題)").attr('title', this.mylist.getTitle());
    };

    FavlistMylistsMylistView.prototype.updateVideos = function () {
        var _this = this;
        var count = this.mylist.getNewCount();
        this.$el.toggleClass('hasNewVideo', count > 0);
        this.$el.find('.favlistMylistNewCount').text(count.toString());
        this.$el.find('.favlistMylistClearButton').attr('disabled', count === 0).toggleClass('disabled', count === 0);

        this.videoViews = [];
        this.$videos.empty();
        this.getVisibleVideos().forEach(function (video) {
            var videoView = new FavlistMylistsVideoView(_this.$videos, video);
            _this.setEventHandlersForVideoView(videoView);
            videoView.show();
            _this.videoViews.push(videoView);
        });
    };

    FavlistMylistsMylistView.prototype.getVisibleVideos = function () {
        var videos = this.mylist.getNewVideos();

        var order = this.config.isOrderDescendant() ? 1 : -1;
        videos.sort(function (a, b) {
            return (b.getTimestamp() - a.getTimestamp()) * order;
        });

        var max = this.config.getMaxNewVideos();
        return (max > 0) ? videos.slice(0, max) : videos;
    };

    FavlistMylistsMylistView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistMylistClearButton').click(function () {
            _this.emitEvent('mylistClearRequest', [_this.mylist]);
            return false;
        });

        this.mylist.addListener('updateTitle', function () {
            _this.updateTitle();
        });
        this.mylist.addListener('updateVideos', function () {
            _this.updateVideos();
        });
    };

    FavlistMylistsMylistView.prototype.setEventHandlersForVideoView = function (videoView) {
        var _this = this;
        videoView.addListener('videoWatch', function (video) {
            _this.emitEvent('mylistVideoWatch', [_this.mylist, video]);
        });
    };
    return FavlistMylistsMylistView;
})(View);
var FavlistMylistsView = (function (_super) {
    __extends(FavlistMylistsView, _super);
    function FavlistMylistsView($parent, config, mylistCollection, mylistCollectionUpdater) {
        _super.call(this, $parent, Template.load(Templates.favlist_mylists));
        this.config = config;
        this.mylistCollection = mylistCollection;
        this.mylistCollectionUpdater = mylistCollectionUpdater;
        this.mylistViews = {};
        this.$mylists = this.$el.find('.favlistMylists');
        this.setEventHandlers();
    }
    FavlistMylistsView.prototype.update = function () {
        this.$el.toggleClass('noMylist', this.mylistCollection.isEmpty());
        this.$el.toggleClass('checkedMylistHidden', this.config.isCheckedListHidden());
        this.updateMylistViews();
    };

    FavlistMylistsView.prototype.updateMylistViews = function () {
        var _this = this;
        this.mylistViews = {};
        this.$mylists.empty();
        this.mylistCollection.getMylists().forEach(function (mylist) {
            var mylistView = new FavlistMylistsMylistView(_this.$mylists, _this.config, mylist);
            mylistView.addEventDelegator(function (eventName, args) {
                return _this.emitEvent(eventName, args);
            });
            mylistView.show();
            _this.mylistViews[mylist.getMylistId().toString()] = mylistView;
        });
    };

    FavlistMylistsView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistCheckNowButton').click(function () {
            _this.emitEvent('checkNowRequest', [_this.mylistCollection]);
            return false;
        });
        this.setEventHandlersForMylistCollectionUpdater();
    };

    FavlistMylistsView.prototype.setEventHandlersForMylistCollectionUpdater = function () {
        var _this = this;
        var updateMylistViewStatus = function (mylist, status, dismiss) {
            if (typeof dismiss === "undefined") { dismiss = false; }
            var mylistView = _this.mylistViews[mylist.getMylistId().toString()];
            if (!mylistView)
                return null;
            if (status !== null) {
                mylistView.showStatus(status, dismiss);
            } else {
                mylistView.hideStatus();
            }
            return mylistView;
        };
        this.mylistCollectionUpdater.addListener('startUpdateAll', function () {
            _this.$el.find('.favlistCheckNowButton').attr('disabled', true).addClass('disabled');
            _this.mylistCollection.getMylists().forEach(function (mylist) {
                updateMylistViewStatus(mylist, 'waiting');
            });
        });
        this.mylistCollectionUpdater.addListener('startUpdateMylist', function (mylist) {
            updateMylistViewStatus(mylist, 'updating');
        });
        this.mylistCollectionUpdater.addListener('failedUpdateMylist', function (mylist, error) {
            updateMylistViewStatus(mylist, 'failed', true);
        });
        this.mylistCollectionUpdater.addListener('finishUpdateMylist', function (mylist) {
            updateMylistViewStatus(mylist, null);
        });
        this.mylistCollectionUpdater.addListener('finishUpdateAll', function () {
            _this.$el.find('.favlistCheckNowButton').removeAttr('disabled').removeClass('disabled');
        });
    };
    return FavlistMylistsView;
})(View);
var FavlistSettingsView = (function (_super) {
    __extends(FavlistSettingsView, _super);
    function FavlistSettingsView($parent, config, mylistCollection) {
        _super.call(this, $parent, Template.load(Templates.favlist_settings));
        this.config = config;
        this.mylistCollection = mylistCollection;
        this.$mylists = this.$el.find('.favlistSettingMylists');
        this.setEventHandlers();
    }
    FavlistSettingsView.prototype.update = function () {
        this.updateMylistViews();
        this.updateConfigView();
    };

    FavlistSettingsView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistSaveSettingsButton').click(function () {
            try  {
                var mylists = _this.getSavedMylists();
                var config = _this.getSavedConfig();
            } catch (e) {
                alert(e.message || e);
                return false;
            }
            _this.emitEvent('settingSave', [mylists, config]);
            return false;
        });
        this.$el.find('.favlistCancelSettingsButton').click(function () {
            _this.emitEvent('settingCancel');
            return false;
        });
    };

    FavlistSettingsView.prototype.getSavedMylists = function () {
        var savedMylists = [];
        this.$mylists.children().each(function (i, el) {
            var $mylist = $(el);
            var mylistId = $mylist.data('mylistId');
            if (!mylistId) {
                throw new Error('保存中にエラーが発生しました');
            }
            var title = $mylist.find('.favlistMylistTitleEdit').val();
            savedMylists.push({ mylistId: mylistId, title: title });
        });
        return savedMylists;
    };

    FavlistSettingsView.prototype.getSavedConfig = function () {
        var checkInterval = parseInt(this.$el.find('.favlistConfigCheckInterval').val(), 10);
        if (isNaN(checkInterval)) {
            throw new Error('更新チェック間隔は整数で指定してください');
        }

        var maxNewVideos = parseInt(this.$el.find('.favlistConfigMaxNewVideos').val(), 10);
        if (isNaN(maxNewVideos)) {
            throw new Error('新着動画の表示数は整数で指定してください');
        }

        var hideCheckedList = this.$el.find('.favlistConfigHideCheckedList').is(':checked');
        var orderDescendant = this.$el.find('.favlistConfigOrderDescendant').is(':checked');

        return new Config(checkInterval, maxNewVideos, hideCheckedList, orderDescendant);
    };

    FavlistSettingsView.prototype.updateMylistViews = function () {
        var _this = this;
        var $template = $(Template.load(Templates.favlist_settings_mylist));

        this.$mylists.empty();
        this.mylistCollection.getMylists().forEach(function (mylist) {
            var $mylist = $template.clone();
            $mylist.data('mylistId', mylist.getMylistId());
            $mylist.find('.favlistMylistTitleEdit').val(mylist.getTitle()).attr('placeholder', mylist.getOriginalTitle());
            _this.setEventHandlersForMylistView($mylist);
            _this.$mylists.append($mylist);
        });
        this.updateMylistButtons();
    };

    FavlistSettingsView.prototype.updateMylistButtons = function () {
        var $mylists = this.$mylists.children();
        var total = $mylists.length;
        $mylists.each(function (i, el) {
            var $mylist = $(el);
            $mylist.find('.favlistMylistMoveUpButton').attr('disabled', (i === 0));
            $mylist.find('.favlistMylistMoveDownButton').attr('disabled', (i === total - 1));
            $mylist.find('.favlistMylistMoveTopButton').attr('disabled', (i === 0));
        });
    };

    FavlistSettingsView.prototype.setEventHandlersForMylistView = function ($mylist) {
        var _this = this;
        $mylist.find('.favlistMylistMoveUpButton').click(function () {
            var $prev = $mylist.prev();
            if ($prev.length > 0) {
                $mylist.insertBefore($prev);
                _this.updateMylistButtons();
            }
        });
        $mylist.find('.favlistMylistMoveDownButton').click(function () {
            var $next = $mylist.next();
            if ($next.length > 0) {
                $mylist.insertAfter($next);
                _this.updateMylistButtons();
            }
        });
        $mylist.find('.favlistMylistMoveTopButton').click(function () {
            $mylist.parent().prepend($mylist);
            _this.updateMylistButtons();
        });
        $mylist.find('.favlistMylistRemoveButton').click(function () {
            $mylist.remove();
            _this.updateMylistButtons();
        });
    };

    FavlistSettingsView.prototype.updateConfigView = function () {
        this.$el.find('.favlistConfigCheckInterval').val(this.config.getCheckInterval().toString());
        this.$el.find('.favlistConfigMaxNewVideos').val(this.config.getMaxNewVideos().toString());
        this.$el.find('.favlistConfigHideCheckedList').attr('checked', this.config.isCheckedListHidden());
        this.$el.find('.favlistConfigOrderDescendant').attr('checked', this.config.isOrderDescendant());
    };
    return FavlistSettingsView;
})(View);
var FavlistView = (function (_super) {
    __extends(FavlistView, _super);
    function FavlistView(config, mylistCollection, mylistCollectionUpdater) {
        _super.call(this, FavlistView.createContainer(), Template.load(Templates.favlist));
        this.config = config;
        this.mylistCollection = mylistCollection;
        this.mylistCollectionUpdater = mylistCollectionUpdater;
        this.$pages = this.$el.find('.favlistPages');
        this.setEventHandlers();
    }
    FavlistView.prototype.showMylistPage = function () {
        this.$pages.children().hide();
        this.getMylistCollectionView().show();
        this.$el.removeClass('inSettingView');
    };

    FavlistView.prototype.showSettingPage = function () {
        this.$pages.children().hide();
        this.getSettingView().show();
        this.$el.addClass('inSettingView');
    };

    FavlistView.prototype.getMylistCollectionView = function () {
        var _this = this;
        if (this.mylistsView) {
            return this.mylistsView;
        }
        this.mylistsView = new FavlistMylistsView(this.$pages, this.config, this.mylistCollection, this.mylistCollectionUpdater);
        this.mylistsView.addEventDelegator(function (eventName, args) {
            return _this.emitEvent(eventName, args);
        });
        return this.mylistsView;
    };

    FavlistView.prototype.getSettingView = function () {
        var _this = this;
        if (this.settingsView) {
            return this.settingsView;
        }

        this.settingsView = new FavlistSettingsView(this.$pages, this.config, this.mylistCollection);
        this.settingsView.addEventDelegator(function (eventName, args) {
            return _this.emitEvent(eventName, args);
        });
        return this.settingsView;
    };

    FavlistView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistSettingButton').click(function () {
            _this.emitEvent('settingPageRequest');
            return false;
        });
    };

    FavlistView.createContainer = function () {
        var $parent = $('#favlistRescueContainer, #sideContents, .column.sub').eq(0);
        if ($parent.length === 0) {
            $parent = FavlistView.createRescueContainer();
        }
        return $('<div />').prependTo($parent);
    };

    FavlistView.createRescueContainer = function () {
        var $outer = Template.load(Templates.favlist_rescue);
        var $container = $outer.find('#favlistRescueContainer');

        $outer.find('.favlistRescueCaption a').click(function () {
            $outer.toggleClass('closed');
            return false;
        });

        $outer.appendTo(window.document.body);
        return $container;
    };
    return FavlistView;
})(View);
var FavlistController = (function () {
    function FavlistController(config, configStorage, mylistCollectionStorage, mylistCollectionUpdater) {
        this.config = config;
        this.configStorage = configStorage;
        this.mylistCollectionStorage = mylistCollectionStorage;
        this.mylistCollectionUpdater = mylistCollectionUpdater;
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.favlistView = new FavlistView(this.config, this.mylistCollection, this.mylistCollectionUpdater);
        this.setEventHandlers();
    }
    FavlistController.prototype.start = function () {
        this.favlistView.show();
        this.favlistView.showMylistPage();
        this.mylistCollectionUpdater.updateAllIfExpired(this.mylistCollection);
    };

    FavlistController.prototype.setEventHandlers = function () {
        var _this = this;
        this.favlistView.addListener('settingPageRequest', function () {
            _this.favlistView.showSettingPage();
        });
        this.setEventHandlersForMylistsView();
        this.setEventHandlersForMylistCollectionUpdater();
        this.setEventHandlersForSettingsView();
    };

    FavlistController.prototype.setEventHandlersForMylistsView = function () {
        var _this = this;
        this.favlistView.addListener('checkNowRequest', function () {
            _this.mylistCollectionUpdater.updateAll(_this.mylistCollection);
        });
        this.favlistView.addListener('mylistClearRequest', function (mylist) {
            mylist.markAllVideosAsWatched();
            _this.mylistCollectionStorage.store(_this.mylistCollection);
        });
        this.favlistView.addListener('mylistVideoWatch', function (mylist, video) {
            mylist.markVideoAsWatched(video);
            _this.mylistCollectionStorage.store(_this.mylistCollection);
        });
    };

    FavlistController.prototype.setEventHandlersForMylistCollectionUpdater = function () {
        var _this = this;
        this.mylistCollectionUpdater.addListener('finishUpdateAll', function () {
            _this.mylistCollectionStorage.store(_this.mylistCollection);
        });
    };

    FavlistController.prototype.setEventHandlersForSettingsView = function () {
        var _this = this;
        this.favlistView.addListener('settingSave', function (savedMylists, savedConfig) {
            var newMylists = [];
            savedMylists.forEach(function (savedMylist) {
                var mylist = _this.mylistCollection.get(savedMylist.mylistId);
                if (mylist) {
                    mylist.setOverrideTitle(savedMylist.title);
                    newMylists.push(mylist);
                }
            });
            _this.mylistCollection.setMylists(newMylists);
            _this.mylistCollectionStorage.store(_this.mylistCollection);

            _this.config.update(savedConfig);
            _this.configStorage.store(_this.config);

            _this.favlistView.showMylistPage();
        });

        this.favlistView.addListener('settingCancel', function () {
            _this.favlistView.showMylistPage();
        });
    };
    return FavlistController;
})();
var SubscribeView = (function (_super) {
    __extends(SubscribeView, _super);
    function SubscribeView() {
        _super.call(this, SubscribeView.findParent(), Template.load(Templates.subscribe));
        this.subscribed = false;
        this.setEventHandlers();
    }
    SubscribeView.prototype.setSubscribed = function (subscribed) {
        if (this.subscribed !== subscribed) {
            this.subscribed = subscribed;
            this.$el.toggleClass('subscribed', this.subscribed);
        }
    };

    SubscribeView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistSubscribeButton').click(function () {
            _this.emitEvent('subscribeRequest');
            return false;
        });
        this.$el.find('.favlistUnsubscribeButton').click(function () {
            _this.emitEvent('unsubscribeRequest');
            return false;
        });
    };

    SubscribeView.findParent = function () {
        var $parent = $('.content_312').eq(0);
        if ($parent.length > 0) {
            return $('<div />').css({
                'padding': '10px',
                'text-align': 'center'
            }).prependTo($parent);
        }

        $parent = $('#watchBtns').eq(0);
        if ($parent.length > 0) {
            return $('<div />').css({
                'display': 'inline-block',
                'margin-left': '8px'
            }).insertAfter($parent);
        }

        $parent = Template.load(Templates.subscribe_rescue);
        $parent.appendTo(document.body);
        return $parent;
    };
    return SubscribeView;
})(View);
var SubscribeController = (function () {
    function SubscribeController(mylistCollectionStorage, updateInterval) {
        this.mylistCollectionStorage = mylistCollectionStorage;
        this.updateInterval = updateInterval;
        this.subscribeView = new SubscribeView();
        this.mylist = this.createMylistFromPage();
        this.setEventHandlers();
    }
    SubscribeController.prototype.start = function () {
        this.reloadMylistCollection();
        this.subscribeView.show();
    };

    SubscribeController.prototype.setEventHandlers = function () {
        var _this = this;
        this.subscribeView.addListener('subscribeRequest', function () {
            _this.subscribe();
        });
        this.subscribeView.addListener('unsubscribeRequest', function () {
            _this.unsubscribe();
        });
    };

    SubscribeController.prototype.subscribe = function () {
        this.reloadMylistCollection();
        if (!this.mylistIsSubscribed()) {
            this.mylistCollection.add(this.mylist);
            this.mylistCollectionStorage.store(this.mylistCollection);
            this.updateInterval.expire();
            this.subscribeView.setSubscribed(true);
        }
    };

    SubscribeController.prototype.unsubscribe = function () {
        this.reloadMylistCollection();
        if (this.mylistIsSubscribed()) {
            this.mylistCollection.removeById(this.mylist.getMylistId());
            this.mylistCollectionStorage.store(this.mylistCollection);
            this.updateInterval.expire();
            this.subscribeView.setSubscribed(false);
        }
    };

    SubscribeController.prototype.reloadMylistCollection = function () {
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.subscribeView.setSubscribed(this.mylistIsSubscribed());
    };

    SubscribeController.prototype.mylistIsSubscribed = function () {
        return this.mylistCollection.contains(this.mylist.getMylistId());
    };

    SubscribeController.prototype.createMylistFromPage = function () {
        var mylistId = MylistId.fromURL(window.location.href);
        var title;

        var $title = $([
            '#SYS_box_mylist_header h1',
            '.userDetail .profile h2'
        ].join(',')).eq(0);

        if ($title.length > 0) {
            title = $title.text();
        } else {
            title = window.document.title.replace(/(?:のユーザーページ)?[ ‐-]+(?:ニコニコ動画|niconico).*$/, '');
        }
        if (mylistId.getIdType() === MylistIdType.User) {
            title += 'の投稿動画';
        }

        return new Mylist(mylistId, title);
    };
    return SubscribeController;
})();
var util;
(function (util) {
    var initializers = {};
    var instances = {};

    util.DI = {
        register: function (name, initializer) {
            initializers[name] = initializer;
        },
        resolve: function (name) {
            if (typeof instances[name] !== 'undefined') {
                return instances[name];
            }
            if (typeof initializers[name] === 'undefined') {
                throw new Error('[DI] Not registered: ' + name);
            }
            instances[name] = initializers[name]();
            initializers[name] = undefined;
            delete initializers[name];
            return instances[name];
        }
    };
})(util || (util = {}));
var DI = util.DI;

DI.register('Storage', function () {
    return util.chooseStorage();
});

DI.register('UrlFetcher', function () {
    return util.chooseUrlFetcher();
});

DI.register('Config', function () {
    return DI.resolve('ConfigStorage').get();
});

DI.register('ConfigStorage', function () {
    return new ConfigStorage(DI.resolve('Storage'));
});

DI.register('MylistCollectionStorage', function () {
    return new MylistCollectionStorage(DI.resolve('Storage'));
});

DI.register('MylistCollectionUpdater', function () {
    return new MylistCollectionUpdater(DI.resolve('UpdateInterval'), DI.resolve('MylistFeedFactory'));
});

DI.register('MylistFeedFactory', function () {
    return new MylistFeedFactory(DI.resolve('UrlFetcher'), DI.resolve('Config').getUserAgent());
});

DI.register('UpdateInterval', function () {
    return new UpdateInterval(DI.resolve('Storage'), DI.resolve('Config'));
});

DI.register('FavlistApp', function () {
    return new FavlistApp();
});

DI.register('FavlistController', function () {
    return new FavlistController(DI.resolve('Config'), DI.resolve('ConfigStorage'), DI.resolve('MylistCollectionStorage'), DI.resolve('MylistCollectionUpdater'));
});

DI.register('SubscribeController', function () {
    return new SubscribeController(DI.resolve('MylistCollectionStorage'), DI.resolve('UpdateInterval'));
});
$(function () {
    DI.resolve('FavlistApp').start();
});

})(jQuery);
