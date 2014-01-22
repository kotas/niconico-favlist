// ==UserScript==
// @name           NicoNicoFavlist
// @version        1.3.2
// @author         Kota Saito <kotas.nico@gmail.com>
// @copyright      2007-2014 Kota Saito
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
Template.html['favlist'] = "<div class=\"favlistView\">\n<div class=\"favlistHeader\">\n<div class=\"favlistHeaderTitle\">favlist</div>\n<a href=\"#\" class=\"favlistSettingButton\">設定</a>\n</div>\n</div>";
Template.html['favlist_mylists'] = "<div class=\"favlistMylistsView\">\n<div class=\"favlistNoMylist\">\n<div class=\"favlistNoMylistTitle\">マイリストが登録されていません</div>\n<div class=\"favlistNoMylistDescription\">チェックしたいマイリストのページで「favlist に登録」してください！</div>\n</div>\n<div class=\"favlistMylists\">\n</div>\n<div class=\"favlistMylistsButtons\">\n<button class=\"favlistCheckNowButton\">今すぐ更新</button>\n</div>\n</div>";
Template.html['favlist_mylists_mylist'] = "<div class=\"favlistMylist\">\n<div class=\"favlistMylistInner\">\n<div class=\"favlistMylistHeader\">\n<div class=\"favlistMylistTitleLabel\">\n<span class=\"favlistMylistNewCountLabel\">\n(<span class=\"favlistMylistNewCount\"></span>)\n</span>\n<a href=\"#\" class=\"favlistMylistTitle favlistMylistLink\"></a>\n</div>\n<div class=\"favlistMylistButtons\">\n<button class=\"favlistMylistClearButton\">クリア</button>\n</div>\n<div class=\"favlistMylistStatus\">\n<span class=\"waiting\">待機中</span>\n<span class=\"updating\">更新中</span>\n<span class=\"private\">非公開</span>\n<span class=\"deleted\">削除された</span>\n<span class=\"error\">更新失敗</span>\n</div>\n</div>\n<div class=\"favlistMylistVideos\">\n</div>\n</div>\n</div>";
Template.html['favlist_mylists_video'] = "<div class=\"favlistVideo\">\n<div class=\"favlistVideoHeader\">\n<div class=\"favlistVideoThumbnail\">\n<a href=\"\" title=\"\" class=\"favlistVideoLink\"><img src=\"\" /></a>\n</div>\n<div class=\"favlistVideoInfo\">\n<a href=\"\" title=\"\" class=\"favlistVideoLink favlistVideoTitle\"></a>\n<span class=\"favlistVideoTimestamp\"></span>\n</div>\n</div>\n<div class=\"favlistVideoMemo\">\n<div class=\"favlistVideoMemoText\"></div>\n</div>\n</div>";
Template.html['favlist_rescue'] = "<div class=\"favlistViewRescue\">\n<div class=\"favlistRescueCaption\">\nレスキューモードで実行中 (\n<a href=\"#\" class=\"favlistRescueClose\">Favlist を閉じる</a>\n<a href=\"#\" class=\"favlistRescueOpen\">Favlist を開く</a>\n)\n</div>\n<div class=\"favlistRescueContainer\"></div>\n</div>";
Template.html['favlist_settings'] = "<div class=\"favlistSettingsView\">\n<div class=\"favlistSettingOverlay\"></div>\n<div class=\"favlistSettingsDialog\">\n<div class=\"favlistSettingsMainPage\">\n<div class=\"favlistSettingMylistSearch\">\n<label>\n<span>検索</span>\n<input class=\"favlistSettingMylistSearchEdit\" type=\"search\" value=\"\" placeholder=\"マイリスト名 または URL\" />\n</label>\n</div>\n<div class=\"favlistSettingMylistsOuter\">\n<div class=\"favlistSettingMylists\">\n</div>\n</div>\n<form class=\"favlistConfig\" action=\"javascript:void(0);\">\n<ul class=\"favlistConfigItems\">\n<li><label>更新チェック間隔 <input type=\"text\" class=\"favlistConfigText favlistConfigCheckInterval\" value=\"\" size=\"6\" /> 秒</label></li>\n<li><label>新着動画の表示数 <input type=\"text\" class=\"favlistConfigText favlistConfigMaxNewVideos\" value=\"\" size=\"6\" /> 件まで</label></li>\n<li><label><input type=\"checkbox\" class=\"favlistConfigCheckbox favlistConfigHideCheckedList\" value=\"1\" /> 新着がないマイリストを隠す</label></li>\n<li><label><input type=\"checkbox\" class=\"favlistConfigCheckbox favlistConfigOrderDescendant\" value=\"1\" /> 動画を新しい順に並べる</label></li>\n</ul>\n</form>\n<div class=\"favlistSettingsFooter\">\n<div class=\"favlistSettingsLinks\">\n<a href=\"#\" class=\"favlistSettingsImportLink\" title=\"エクスポートされたテキスト形式の設定をインポート\">インポート</a>\n<a href=\"#\" class=\"favlistSettingsExportLink\" title=\"テキスト形式で設定をエクスポート\">エクスポート</a>\n<a href=\"#\" class=\"favlistSettingsOPMLExportLink\" title=\"RSSリーダーなどで利用できる OPML 形式でマイリスト一覧をダウンロード\">OPML</a>\n</div>\n<div class=\"favlistSettingsButtons\">\n<button class=\"favlistButtonSave favlistSaveSettingsButton\">設定を保存</button>\n<button class=\"favlistCancelSettingsButton\">キャンセル</button>\n</div>\n</div>\n</div>\n<div class=\"favlistSettingsEditorPage\">\n<div class=\"favlistSettingsEditorHeader\">\n<span class=\"favlistImportMode\">下のテキストボックスに、エクスポートされた設定を貼り付けると設定を反映できます。</span>\n<span class=\"favlistExportMode\">下のテキストをコピーして、他のブラウザでインポートすると設定をコピーできます。</span>\n</div>\n<div class=\"favlistSettingsEditorForm\">\n<textarea class=\"favlistImportMode favlistSettingsImportEditor\"></textarea>\n<textarea class=\"favlistExportMode favlistSettingsExportEditor\" readonly></textarea>\n</div>\n<div class=\"favlistSettingsEditorFooter\">\n<div class=\"favlistSettingsButtons favlistImportMode\">\n<button class=\"favlistButtonSave favlistImportApplyButton\">反映</button>\n<button class=\"favlistImportCancelButton\">キャンセル</button>\n</div>\n<div class=\"favlistSettingsLinks favlistExportMode\">\n<a href=\"#\" class=\"favlistSettingsDownloadExportLink\" download=\"favlist.dat\" title=\"エクスポート内容をダウンロード\">ダウンロード</a>\n</div>\n<div class=\"favlistSettingsButtons favlistExportMode\">\n<button class=\"favlistExportCloseButton\">閉じる</button>\n</div>\n</div>\n</div>\n</div>\n</div>";
Template.html['favlist_settings_mylist'] = "<div class=\"favlistSettingMylist\">\n<div class=\"favlistSettingMylistLink\">\n<a class=\"favlistMylistLink\" href=\"\" title=\"別ウィンドウで開く\" target=\"_blank\">開く</a>\n</div>\n<div class=\"favlistSettingMylistTitle\">\n<input class=\"favlistMylistTitleEdit\" type=\"text\" value=\"\" />\n</div>\n<div class=\"favlistSettingMylistButtons\">\n<div class=\"favlistSettingMylistMoveButtons\"><!--\n--><button class=\"favlistMylistMoveUpButton\" title=\"1つ上に移動\">▲</button><!--\n--><button class=\"favlistMylistMoveDownButton\" title=\"1つ下に移動\">▼</button><!--\n--><button class=\"favlistMylistMoveTopButton\" title=\"一番上に移動\">↑</button><!--\n--></div>\n<button class=\"favlistMylistRemoveButton favlistButtonDelete\" title=\"favlist への登録を解除\">削除</button>\n</div>\n</div>";
Template.html['subscribe'] = "<div class=\"favlistSubscribeView\">\n<button class=\"favlistSubscribeButton\"><span>★</span> favlist に登録</button>\n<button class=\"favlistUnsubscribeButton\"><span>×</span> favlist の登録を解除</button>\n</div>";
Template.html['subscribe_rescue'] = "<div id=\"favlistSubscribeViewRescue\">\n</div>";
Template.css['favlist'] = ".favlistView {\nbackground: white;\nfont-size: 12px;\nline-height: 1.2em;\nmargin-bottom: 8px;\nborder-radius: 2px;\nbox-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);\nwidth: 100%;\n}\n.favlistHeader {\ndisplay: table;\nwidth: 100%;\nheight: 30px;\n}\n.favlistHeaderTitle {\ndisplay: table-cell;\npadding: 5px 10px;\nbackground: #ccc;\ncolor: #333;\nfont-size: 13px;\nfont-weight: bold;\nvertical-align: middle;\n}\n.favlistSettingButton {\ndisplay: table-cell;\nbackground: #336666;\nwidth: 4em;\ntext-align: center;\ncolor: #ffffff !important;\ntext-decoration: none;\nwhite-space: nowrap;\nvertical-align: middle;\n}\n.favlistSettingButton:hover {\nbackground: #669999;\ntext-decoration: underline;\n}\n.inSettingView .favlistSettingButton {\ndisplay: none;\n}\na.favlistMylistLink, a.favlistMylistLink:link,\na.favlistVideoLink, a.favlistVideoLink:link {\ncolor: #006699 !important;\n}\na.favlistMylistLink:visited, a.favlistVideoLink:visited {\ncolor: #005584 !important;\n}\na.favlistMylistLink:hover, a.favlistVideoLink:hover {\ncolor: #0584C3 !important;\n}\na.favlistMylistLink:active, a.favlistVideoLink:active {\ncolor: #52aeea !important;\n}\n.favlistView button {\ndisplay: inline-block;\npadding: 2px 10px;\nbackground: #666666;\nfont-family: sans-serif;\ncolor: white;\nborder: none;\nborder-radius: 4px;\nwhite-space: nowrap;\n}\n.favlistView button.disabled,\n.favlistView button[disabled] {\ncursor: not-allowed;\npointer-events: none;\nopacity: .2;\n}\n.favlistView button:hover {\nbackground: #777777;\n}\n.favlistView button:active {\nbackground: #555555;\n}\n.favlistView button.favlistButtonSave {\nbackground: #339933;\n}\n.favlistView button.favlistButtonSave:hover {\nbackground: #55BB55;\n}\n.favlistView button.favlistButtonSave:active {\nbackground: #228822;\n}\n.favlistView button.favlistButtonDelete {\nbackground: #8b433b;\n}\n.favlistView button.favlistButtonDelete:hover {\nbackground: #9e4c43;\n}\n.favlistView button.favlistButtonDelete:active {\nbackground: #703830;\n}";
Template.css['favlist_mylists'] = ".favlistMylistsView {\npadding: 10px;\nposition: relative;\n}\n.favlistNoMylist {\ndisplay: none;\n}\n.noMylist .favlistNoMylist {\ndisplay: block;\n}\n.favlistNoMylistTitle {\npadding: 30px;\ntext-align: center;\ncolor: #cccccc;\n}\n.noMylist .favlistMylists {\ndisplay: none;\n}\n.noMylist .favlistMylistsButtons {\ndisplay: none;\n}\n.favlistMylistsButtons button {\nmargin-right: 4px;\n}";
Template.css['favlist_mylists_mylist'] = ".favlistMylistInner {\nmargin-bottom: 8px;\npadding-bottom: 8px;\nborder-bottom: 1px solid #eeeeee;\n}\n.checkedMylistHidden .favlistMylistInner {\ndisplay: none;\n}\n.checkedMylistHidden .hasNewVideo .favlistMylistInner,\n.checkedMylistHidden .hasStatus .favlistMylistInner {\ndisplay: block;\n}\n.favlistMylistHeader {\ndisplay: table;\nwidth: 100%;\n}\n.favlistMylistTitleLabel {\ndisplay: table-cell;\nwidth: 100%;\nmax-width: 1px;\noverflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap;\nvertical-align: middle;\n}\n.favlistMylist.hasNewVideo .favlistMylistTitleLabel {\nfont-weight: bold;\n}\n.favlistMylistNewCountLabel {\ndisplay: none;\ncolor: #C00;\nwhite-space: nowrap;\n}\n.favlistMylist.hasNewVideo .favlistMylistNewCountLabel {\ndisplay: inline;\n}\n.favlistMylistButtons {\ndisplay: table-cell;\npadding-left: 8px;\n}\n.favlistMylistButtons button {\nfont-size: 10px;\n}\n.favlistMylist.hasStatus .favlistMylistButtons {\ndisplay: none;\n}\n.favlistMylistStatus {\ndisplay: none;\n}\n.favlistMylist.hasStatus .favlistMylistStatus {\ndisplay: table-cell;\npadding-left: 8px;\n}\n.favlistMylistStatus span {\ndisplay: inline-block;\npadding: 2px 10px;\nborder-radius: 10px;\nbackground: black;\nfont-size: 10px;\ncolor: white;\nwhite-space: nowrap;\n}\n.favlistMylistStatus span.waiting {\ncolor: #999;\nbackground: #efefef;\n}\n.favlistMylistStatus span.updating {\nbackground: #36689d;\n}\n.favlistMylistStatus span.private,\n.favlistMylistStatus span.deleted,\n.favlistMylistStatus span.error {\nbackground: #900;\n}";
Template.css['favlist_mylists_video'] = ".favlistVideo {\nmargin: 8px 4px 0;\n}\n.favlistVideoHeader {\ndisplay: table;\nwidth: 100%;\n}\n.favlistVideoThumbnail {\ndisplay: table-cell;\nvertical-align: middle;\npadding-right: 8px;\n}\n.favlistVideoThumbnail a img {\nborder: none;\nwidth: 46px;\nheight: 34px;\n}\n.favlistVideoInfo {\ndisplay: table-cell;\nvertical-align: middle;\nwidth: 100%;\nfont-size: 11px;\n}\n.favlistVideoTitle {\nmargin-right: 4px;\n}\n.favlistVideoTimestamp {\nfont-size: 9px;\ncolor: #999;\nwhite-space: nowrap;\n}\n.favlistVideoMemo {\nmargin-top: 4px;\npadding: 4px 8px;\nborder-radius: 2px;\nbackground: #efefef;\nbox-shadow: 1px 1px 1px #ccc;\ncursor: pointer;\n}\n.favlistVideoMemo:hover {\nbackground: #f3f3f3;\n}\n.favlistVideoMemoText {\ndisplay: block;\nmax-height: 28px;\noverflow: hidden;\nfont-size: 10px;\n}\n.favlistVideoMemo.expanded .favlistVideoMemoText {\nwhite-space: pre;\nmax-height: none;\n}";
Template.css['favlist_rescue'] = ".favlistViewRescue {\nposition: fixed;\nwidth: 360px;\nmax-height: 300px;\nright: 10px;\nbottom: 10px;\noverflow: auto;\nbackground-color: white;\nborder: 1px solid #cccccc;\n}\n.favlistViewRescue.closed .favlistRescueContainer {\ndisplay: none;\n}\n.favlistRescueCaption {\npadding: 2px 4px;\nfont-size: 12px;\ncolor: #cc0000;\ntext-align: center;\n}\n.favlistRescueOpen,\n.favlistViewRescue.closed .favlistRescueClose {\ndisplay: none;\n}\n.favlistViewRescue.closed .favlistRescueOpen {\ndisplay: inline;\n}";
Template.css['favlist_settings'] = ".favlistSettingOverlay {\nposition: fixed;\ntop: 0;\nleft: 0;\nwidth: 100%;\nheight: 100%;\nz-index: 999999;\nbackground: #333333;\nopacity: 0.6;\n}\n.favlistSettingsDialog {\nposition: fixed;\ntop: 50%;\nleft: 50%;\nwidth: 600px;\nheight: auto;\nz-index: 1000000;\nbackground: #ffffff;\nbox-shadow: 3px 3px 2px rgba(0, 0, 0, 0.3);\ntransform: translateX(-50%) translateY(-50%);\n-webkit-transform: translateX(-50%) translateY(-50%);\n}\n.favlistSettingMylistSearch {\nmargin: 20px 20px 10px 20px;\n}\n.favlistSettingMylistsOuter {\nmargin: 10px 20px 20px 20px;\n}\n.favlistConfig,\n.favlistSettingsFooter {\nmargin: 20px;\n}\n.favlistSettingMylistSearch {\ntext-align: right;\ncolor: #333;\n}\n.favlistSettingMylistSearch span {\nvertical-align: middle;\n}\n.favlistSettingMylistSearchEdit {\nvertical-align: middle;\nwidth: 50%;\nborder: 1px solid #999;\nborder-radius: 5px;\npadding: 2px 5px;\nmargin-left: 5px;\ncolor: #000;\n}\n.favlistSettingMylistsOuter {\nheight: 400px;\nborder: 1px solid #ccc;\noverflow: auto;\n}\n.favlistSettingMylists {\ndisplay: table;\npadding-bottom: 10px;\n}\n.favlistConfigItems {\nlist-style-type: none;\n}\n.favlistConfigItems:after {\ncontent: \"\";\nclear: both;\ndisplay: block;\n}\n.favlistConfigItems li {\nmargin-bottom: 10px;\n}\n.favlistConfigItems li:nth-of-type(1) {\nfloat: left;\nwidth: 250px;\n}\n.favlistConfigItems li:nth-of-type(2) {\nfloat: left;\nwidth: 250px;\nclear: left;\n}\n.favlistConfigItems li label {\ncolor: #333;\n}\n.favlistConfigItems .favlistConfigText {\nmargin-left: 10px;\n}\n.favlistSettingsLinks {\nfloat: left;\npadding-top: 12px;\n}\n.favlistSettingsLinks a {\nfont-size: 12px;\nmargin-right: 10px;\n}\n.favlistSettingsButtons {\ntext-align: right;\n}\n.favlistSettingsButtons button {\nmargin-left: 10px;\nfont-size: 14px;\n}\n.favlistSettingsEditorPage {\ndisplay: none;\n}\n.favlistSettingsEditorPage.importing .favlistExportMode,\n.favlistSettingsEditorPage.exporting .favlistImportMode {\ndisplay: none;\n}\n.favlistSettingsEditorHeader,\n.favlistSettingsEditorForm,\n.favlistSettingsEditorFooter {\nmargin: 20px;\n}\n.favlistSettingsEditorForm textarea {\nheight: 400px;\nwidth: 100%;\n}";
Template.css['favlist_settings_mylist'] = ".favlistSettingMylist {\ndisplay: table-row;\nposition: relative;\n}\n.favlistSettingMylistLink,\n.favlistSettingMylistTitle,\n.favlistSettingMylistButtons {\ndisplay: table-cell;\npadding: 10px 0 0 10px;\nvertical-align: middle;\nwhite-space: nowrap;\n}\n.favlistSettingMylistLink a {\ndisplay: block;\n}\n.favlistSettingMylistTitle {\nwidth: 100%;\n}\n.favlistMylistTitleEdit {\nwidth: 100%;\n}\n.favlistSettingMylistButtons {\npadding-right: 10px;\n}\n.favlistSettingMylistButtons button {\nfont-size: 10px;\nvertical-align: middle;\n}\n.favlistSettingMylistMoveButtons {\ndisplay: inline;\n}\n.favlistSettingMylistMoveButtons button {\npadding: 2px 3px;\nbackground: none;\nfont-family: sans-serif;\ncolor: #666;\n}\n.favlistSettingMylistMoveButtons button.disabled,\n.favlistSettingMylistMoveButtons button[disabled] {\nvisibility: hidden;\n}\n.favlistSettingMylistMoveButtons button:hover {\nbackground: #37992b;\ncolor: #fff;\n}\n.favlistSettingMylistMoveButtons button:active {\nbackground: #0e4d17;\ncolor: #fff;\n}\n.favlistMylistRemoveButton {\npadding: 2px 5px;\nmargin-left: 10px;\n}";
Template.css['subscribe'] = ".favlistSubscribeView {\ndisplay: inline-block;\n}\n.favlistSubscribeView,\n.favlistSubscribeView.subscribed .favlistUnsubscribeButton {\ndisplay: inline-block;\n}\n.favlistSubscribeView.subscribed .favlistSubscribeButton,\n.favlistUnsubscribeButton {\ndisplay: none;\n}\n.favlistSubscribeView button {\npadding: 4px 10px;\ncolor: white;\nborder: none;\nborder-radius: 4px;\nwhite-space: nowrap;\nfont-size: 12px;\nfont-family: sans-serif;\ntext-decoration: none;\ntext-align: center;\ntext-shadow: 0 1px 1px #161e24;\nbackground: #435d69;\n}\n.favlistSubscribeView button:hover {\nbackground: #4f6d7b;\n}\n.favlistSubscribeView button:active {\nbackground: #3d5560;\n}\n.favlistSubscribeButton span {\ncolor: #fc3;\n}\n.favlistUnsubscribeButton span {\ncolor: #ff6462;\n}\n/* for user profile page */\n.profile .favlistSubscribeView button {\npadding: 1px 10px;\nmargin-bottom: 8px;\n}";
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
                if (value === null) {
                    value = '';
                } else {
                    value = String(value);
                }
            }
            return value;
        };

        TypedStorage.prototype.setString = function (key, value) {
            if (typeof value === 'undefined' || value === null) {
                value = '';
            }
            this.storage.set(key, String(value));
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
            if (typeof value !== 'number') {
                value = parseInt(value) || 0;
            }
            this.storage.set(key, value.toString());
        };

        TypedStorage.prototype.getBoolean = function (key, defaultValue) {
            var value = this.storage.get(key);
            if (value === true || value === false) {
                return value;
            }
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

    var UpdateTimeStorage = (function () {
        function UpdateTimeStorage(storage, key) {
            this.key = key;
            this.storage = new TypedStorage(storage);
        }
        UpdateTimeStorage.prototype.isChanged = function () {
            return (this.lastUpdateTime !== this.getLastUpdateTime());
        };

        UpdateTimeStorage.prototype.fetch = function () {
            this.lastUpdateTime = this.getLastUpdateTime();
        };

        UpdateTimeStorage.prototype.update = function () {
            this.updateLastUpdateTime();
        };

        UpdateTimeStorage.prototype.getLastUpdateTime = function () {
            return this.storage.getInteger(this.key);
        };

        UpdateTimeStorage.prototype.updateLastUpdateTime = function () {
            this.lastUpdateTime = (new Date()).getTime();
            this.storage.setInteger(this.key, this.lastUpdateTime);
        };
        return UpdateTimeStorage;
    })();
    util.UpdateTimeStorage = UpdateTimeStorage;
})(util || (util = {}));
var util;
(function (util) {
    var Event = (function () {
        function Event() {
        }
        Event.prototype.addListener = function (listener) {
            if (!this.listeners) {
                this.listeners = [];
            }
            this.listeners.push(listener);
        };

        Event.prototype.addOnceListener = function (listener) {
            (listener).once = true;
            this.addListener(listener);
        };

        Event.prototype.removeListener = function (listener) {
            if (!this.listeners)
                return false;

            var index = this.listeners.indexOf(listener);
            if (index < 0) {
                return false;
            }

            this.listeners.splice(index, 1);
            return true;
        };

        Event.prototype.clearListeners = function () {
            this.listeners = null;
        };

        Event.prototype.trigger = function (args) {
            if (!this.listeners)
                return;

            for (var i = this.listeners.length - 1; i >= 0; i--) {
                var listener = this.listeners[i];
                if ((listener).once) {
                    this.listeners.splice(i, 1);
                }
                listener.call(null, args);
            }
        };

        Event.prototype.proxy = function () {
            var _this = this;
            return function (args) {
                _this.trigger(args);
            };
        };
        return Event;
    })();
    util.Event = Event;
})(util || (util = {}));
var Config = (function () {
    function Config(checkInterval, maxNewVideos, hideCheckedList, orderDescendant) {
        if (typeof checkInterval === "undefined") { checkInterval = 30 * 60; }
        if (typeof maxNewVideos === "undefined") { maxNewVideos = 10; }
        if (typeof hideCheckedList === "undefined") { hideCheckedList = false; }
        if (typeof orderDescendant === "undefined") { orderDescendant = false; }
        this.setCheckInterval(checkInterval);
        this.setMaxNewVideos(maxNewVideos);
        this.setCheckedListHidden(hideCheckedList);
        this.setOrderDescendant(orderDescendant);
    }
    Config.prototype.update = function (config) {
        this.setCheckInterval(config.getCheckInterval());
        this.setMaxNewVideos(config.getMaxNewVideos());
        this.setCheckedListHidden(config.isCheckedListHidden());
        this.setOrderDescendant(config.isOrderDescendant());
    };

    Config.prototype.getCheckInterval = function () {
        return this.checkInterval;
    };

    Config.prototype.setCheckInterval = function (value) {
        if (isNaN(value) || value < 0) {
            throw new Error('更新チェック間隔が正の整数ではありません');
        }
        this.checkInterval = value;
    };

    Config.prototype.getMaxNewVideos = function () {
        return this.maxNewVideos;
    };

    Config.prototype.setMaxNewVideos = function (value) {
        if (isNaN(value) || value < 0) {
            throw new Error('新着動画の表示数が正の整数ではありません');
        }
        this.maxNewVideos = value;
    };

    Config.prototype.isCheckedListHidden = function () {
        return this.hideCheckedList;
    };

    Config.prototype.setCheckedListHidden = function (value) {
        this.hideCheckedList = value;
    };

    Config.prototype.isOrderDescendant = function () {
        return this.orderDescendant;
    };

    Config.prototype.setOrderDescendant = function (value) {
        this.orderDescendant = value;
    };
    return Config;
})();
var ConfigStorage = (function () {
    function ConfigStorage(storage) {
        this.onUpdate = new util.Event();
        this.storage = new util.TypedStorage(storage);
        this.updateTime = new util.UpdateTimeStorage(storage, 'configLastUpdateTime');
    }
    ConfigStorage.prototype.checkUpdate = function () {
        if (this.updateTime.isChanged()) {
            this.updateTime.fetch();
            this.onUpdate.trigger(null);
        }
    };

    ConfigStorage.prototype.get = function () {
        var config = new Config(this.storage.getInteger('checkInterval'), this.storage.getInteger('maxNewVideos'), this.storage.getBoolean('hideCheckedList'), this.storage.getBoolean('orderDescendant'));
        this.updateTime.fetch();
        return config;
    };

    ConfigStorage.prototype.store = function (config) {
        this.storage.setInteger('checkInterval', config.getCheckInterval());
        this.storage.setInteger('maxNewVideos', config.getMaxNewVideos());
        this.storage.setBoolean('hideCheckedList', config.isCheckedListHidden());
        this.storage.setBoolean('orderDescendant', config.isOrderDescendant());
        this.updateTime.update();
    };
    return ConfigStorage;
})();
var ConfigService = (function () {
    function ConfigService(configStorage) {
        this.configStorage = configStorage;
        this.onUpdate = new util.Event();
        this.config = this.configStorage.get();
        this.setEventHandlersForConfigStorage();
    }
    ConfigService.prototype.setEventHandlersForConfigStorage = function () {
        var _this = this;
        this.configStorage.onUpdate.addListener(function () {
            _this.config = _this.configStorage.get();
            _this.onUpdate.trigger(null);
        });
    };

    ConfigService.prototype.checkUpdate = function () {
        this.configStorage.checkUpdate();
    };

    ConfigService.prototype.getConfig = function () {
        return this.config;
    };

    ConfigService.prototype.setConfig = function (config) {
        this.config.update(config);
        this.configStorage.store(this.config);
        this.onUpdate.trigger(null);
    };
    return ConfigService;
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
var util;
(function (util) {
    function unescapeHTML(s) {
        return (s || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');
    }
    util.unescapeHTML = unescapeHTML;
})(util || (util = {}));
var MylistFeed = (function () {
    function MylistFeed(xml) {
        this.xml = xml;
    }
    MylistFeed.prototype.getTitle = function () {
        var matched = this.xml.match(/<title>(?:マイリスト )?(.+?)‐ニコニコ動画.*?<\/title>/);

        return matched ? util.unescapeHTML(util.unescapeHTML(matched[1])) : '';
    };

    MylistFeed.prototype.getVideos = function () {
        var videos = [];
        var re_entry = /<entry>([\S\s]*?)<\/entry>/g;
        var matched;
        while (matched = re_entry.exec(this.xml)) {
            videos.push(new MylistFeedEntry(matched[1]).toVideo());
        }
        return videos;
    };
    return MylistFeed;
})();

var MylistFeedEntry = (function () {
    function MylistFeedEntry(xml) {
        this.xml = xml;
    }
    MylistFeedEntry.prototype.toVideo = function () {
        return new Video(this.getVideoId(), this.getTitle(), this.getURL(), this.getThumbnail(), this.getMemo(), this.getTimestamp());
    };

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
        return matches ? util.unescapeHTML(matches[1]) : null;
    };
    return MylistFeedEntry;
})();
var Nicovideo;
(function (Nicovideo) {
    Nicovideo.BASE_URL = 'http://www.nicovideo.jp/';

    function getMylistURL(mylistId) {
        return Nicovideo.BASE_URL + mylistId.toPath();
    }
    Nicovideo.getMylistURL = getMylistURL;

    function getMylistFeedURL(mylistId) {
        return getMylistURL(mylistId) + '?rss=2.0';
    }
    Nicovideo.getMylistFeedURL = getMylistFeedURL;

    function getMylistSimpleFeedURL(mylistId) {
        return getMylistURL(mylistId) + '?rss=atom&nodescription=1&noinfo=1';
    }
    Nicovideo.getMylistSimpleFeedURL = getMylistSimpleFeedURL;
})(Nicovideo || (Nicovideo = {}));
var Mylist = (function () {
    function Mylist(mylistId, originalTitle, overrideTitle, newVideos, watchedVideoIds) {
        if (typeof originalTitle === "undefined") { originalTitle = ''; }
        if (typeof overrideTitle === "undefined") { overrideTitle = ''; }
        if (typeof newVideos === "undefined") { newVideos = []; }
        if (typeof watchedVideoIds === "undefined") { watchedVideoIds = []; }
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

    Mylist.prototype.getFeedURL = function () {
        return Nicovideo.getMylistFeedURL(this.mylistId);
    };

    Mylist.prototype.setOriginalTitle = function (title) {
        this.originalTitle = title;
    };

    Mylist.prototype.setOverrideTitle = function (title) {
        if (title === this.originalTitle) {
            title = '';
        }
        this.overrideTitle = title;
    };

    Mylist.prototype.markVideoAsWatched = function (video) {
        var index = this.newVideos.indexOf(video);
        if (index >= 0) {
            this.newVideos.splice(index, 1);
            this.watchedVideoIds.push(video.getVideoId());
        }
    };

    Mylist.prototype.markAllVideosAsWatched = function () {
        var _this = this;
        this.newVideos.forEach(function (video) {
            _this.watchedVideoIds.push(video.getVideoId());
        });
        this.newVideos = [];
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
    };
    return Mylist;
})();
var MylistCollection = (function () {
    function MylistCollection(mylists) {
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
    };

    MylistCollection.prototype.add = function (mylist) {
        this.mylists.push(mylist);
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
})();
var MylistCollectionSerializer = (function () {
    function MylistCollectionSerializer() {
    }
    MylistCollectionSerializer.prototype.unserialize = function (serialized) {
        var _this = this;
        var mylists = serialized ? serialized.split('#').map(function (s) {
            return _this.unserializeMylist(s);
        }) : [];
        return new MylistCollection(mylists);
    };

    MylistCollectionSerializer.prototype.serialize = function (mylistCollection) {
        var _this = this;
        var mylists = mylistCollection.getMylists();
        return mylists.map(function (mylist) {
            return _this.serializeMylist(mylist);
        }).join('#');
    };

    MylistCollectionSerializer.prototype.unserializeMylist = function (serialized) {
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

    MylistCollectionSerializer.prototype.serializeMylist = function (mylist) {
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

    MylistCollectionSerializer.prototype.unserializeVideo = function (serialized) {
        var data = serialized.split('&');

        var videoId = unescape(data[0] || '');
        var title = unescape(data[1] || '');
        var url = unescape(data[2] || '');
        var thumbnail = unescape(data[3] || '');
        var memo = unescape(data[4] || '');
        var timestamp = parseInt(unescape(data[5])) || 0;

        return new Video(videoId, title, url, thumbnail, memo, timestamp);
    };

    MylistCollectionSerializer.prototype.serializeVideo = function (video) {
        return [
            escape(video.getVideoId() || ''),
            escape(video.getTitle() || ''),
            escape(video.getURL() || ''),
            escape(video.getThumbnail() || ''),
            escape(video.getMemo() || ''),
            escape(video.getTimestamp().toString())
        ].join('&');
    };
    return MylistCollectionSerializer;
})();
var MylistCollectionStorage = (function () {
    function MylistCollectionStorage(storage) {
        this.storage = storage;
        this.onUpdate = new util.Event();
        this.updateTime = new util.UpdateTimeStorage(storage, 'favlistLastUpdateTime');
        this.serializer = new MylistCollectionSerializer();
    }
    MylistCollectionStorage.prototype.checkUpdate = function () {
        if (this.updateTime.isChanged()) {
            this.updateTime.fetch();
            this.onUpdate.trigger(null);
        }
    };

    MylistCollectionStorage.prototype.get = function () {
        var serialized = this.storage.get('favlist');
        var mylistCollection = this.serializer.unserialize(serialized);
        this.updateTime.fetch();
        return mylistCollection;
    };

    MylistCollectionStorage.prototype.store = function (mylistCollection) {
        var serialized = this.serializer.serialize(mylistCollection);
        this.storage.set('favlist', serialized);
        this.updateTime.update();
    };
    return MylistCollectionStorage;
})();
var UpdateInterval = (function () {
    function UpdateInterval(storage, configService) {
        this.storage = storage;
        this.configService = configService;
    }
    UpdateInterval.prototype.isExpired = function () {
        var currentTime = this.getCurrentTimeInSeconds();
        var lastUpdate = this.getLastUpdateTime();
        var interval = this.configService.getConfig().getCheckInterval();
        return (lastUpdate === null || lastUpdate + interval < currentTime);
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

    function getUserAgent() {
        var s = '';
        if (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.name && GM_info.script.version) {
            s = GM_info.script.name + '/' + GM_info.script.version + ' Greasemonkey ';
        }
        if (typeof window.navigator !== 'undefined' && window.navigator.userAgent) {
            s += window.navigator.userAgent;
        }
        return s;
    }

    var GMUrlFetcher = (function () {
        function GMUrlFetcher() {
        }
        GMUrlFetcher.isAvailable = function () {
            return (typeof GM_xmlhttpRequest !== 'undefined');
        };

        GMUrlFetcher.prototype.fetch = function (option, callback) {
            var headers = option.headers || {};
            headers['User-Agent'] = getUserAgent();
            return GM_xmlhttpRequest({
                url: option.url,
                method: option.method,
                headers: headers,
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

            req.setRequestHeader('User-Agent', getUserAgent());
            req.send(null);
            return { abort: function () {
                    req.abort();
                } };
        };
        return XHRUrlFetcher;
    })();
    util.XHRUrlFetcher = XHRUrlFetcher;
})(util || (util = {}));
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MylistFeedFetchError = (function (_super) {
    __extends(MylistFeedFetchError, _super);
    function MylistFeedFetchError(message, httpStatus) {
        _super.call(this, 'MylistFeedFetchError', message);
        this.httpStatus = httpStatus;
    }
    return MylistFeedFetchError;
})(util.CustomError);

var MylistFeedFactory = (function () {
    function MylistFeedFactory(fetcher) {
        this.fetcher = fetcher;
    }
    MylistFeedFactory.prototype.getFeedFromServer = function (mylistId, callback) {
        var options = {
            method: 'GET',
            url: Nicovideo.getMylistSimpleFeedURL(mylistId)
        };
        return this.fetcher.fetch(options, function (error, response) {
            if (error) {
                callback(new MylistFeedFetchError(error.message || error), null);
                return;
            }

            if (response.status === 200) {
                callback(null, new MylistFeed(response.responseText));
            } else {
                callback(new MylistFeedFetchError('Failed to fetch URL: ' + response.statusText, response.status), null);
            }
        });
    };
    return MylistFeedFactory;
})();
var MylistCollectionUpdater = (function () {
    function MylistCollectionUpdater(mylistFeedFactory) {
        this.mylistFeedFactory = mylistFeedFactory;
        this.onStartUpdatingAll = new util.Event();
        this.onFinishUpdatingAll = new util.Event();
        this.onAbortUpdatingAll = new util.Event();
        this.onStartUpdatingMylist = new util.Event();
        this.onFinishUpdatingMylist = new util.Event();
        this.onFailedUpdatingMylist = new util.Event();
    }
    MylistCollectionUpdater.prototype.updateAll = function (collection, callback) {
        var _this = this;
        var mylists = Array.prototype.slice.call(collection.getMylists());
        if (mylists.length === 0) {
            callback && setTimeout(callback, 0);
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
                    _this.onAbortUpdatingAll.trigger(null);
                    callback && setTimeout(callback, 0);
                }
            }
        };

        this.onStartUpdatingAll.trigger(null);

        var updateNext = function () {
            if (aborted) {
                return;
            }

            var mylist = mylists.shift();
            if (!mylist) {
                currentAborter = null;
                _this.onFinishUpdatingAll.trigger(null);
                callback && setTimeout(callback, 0);
                return;
            }
            currentAborter = _this.updateMylist(mylist, updateNext);
        };

        updateNext();
        return aborter;
    };

    MylistCollectionUpdater.prototype.updateMylist = function (mylist, callback) {
        var _this = this;
        this.onStartUpdatingMylist.trigger({ mylist: mylist });
        return this.mylistFeedFactory.getFeedFromServer(mylist.getMylistId(), function (error, feed) {
            if (error) {
                _this.onFailedUpdatingMylist.trigger({ mylist: mylist, error: error, httpStatus: error.httpStatus });
            } else {
                mylist.setOriginalTitle(feed.getTitle());
                mylist.updateVideos(feed.getVideos());
                _this.onFinishUpdatingMylist.trigger({ mylist: mylist });
            }
            callback && callback(error, mylist);
        });
    };
    return MylistCollectionUpdater;
})();
var MylistStatus;
(function (MylistStatus) {
    MylistStatus[MylistStatus["Waiting"] = 0] = "Waiting";
    MylistStatus[MylistStatus["Updating"] = 1] = "Updating";
    MylistStatus[MylistStatus["Finished"] = 2] = "Finished";
    MylistStatus[MylistStatus["Private"] = 3] = "Private";
    MylistStatus[MylistStatus["Deleted"] = 4] = "Deleted";
    MylistStatus[MylistStatus["Error"] = 5] = "Error";
})(MylistStatus || (MylistStatus = {}));

var MylistService = (function () {
    function MylistService(mylistsStorage, updateInterval, feedFactory) {
        this.mylistsStorage = mylistsStorage;
        this.updateInterval = updateInterval;
        this.onUpdate = new util.Event();
        this.onUpdateMylist = new util.Event();
        this.onStartUpdatingAll = new util.Event();
        this.onChangeMylistStatus = new util.Event();
        this.onFinishUpdatingAll = new util.Event();
        this.mylists = this.mylistsStorage.get();
        this.updater = new MylistCollectionUpdater(feedFactory);
        this.setEventHandlersForMylistsStorage();
        this.setEventHandlersForUpdater();
    }
    MylistService.prototype.checkUpdate = function () {
        this.mylistsStorage.checkUpdate();
    };

    MylistService.prototype.getMylistCollection = function () {
        return this.mylists;
    };

    MylistService.prototype.setMylists = function (mylists) {
        this.mylists.setMylists(mylists);
        this.save();
        this.onUpdate.trigger(null);
    };

    MylistService.prototype.updateAllIfExpired = function () {
        if (this.updateInterval.isExpired()) {
            this.updateAll();
        }
    };

    MylistService.prototype.updateAll = function () {
        this.updateInterval.updateLastUpdateTime();
        this.updater.updateAll(this.mylists);
    };

    MylistService.prototype.markMylistAllWatched = function (mylist) {
        mylist.markAllVideosAsWatched();
        this.save();
        this.onUpdateMylist.trigger({ mylist: mylist });
    };

    MylistService.prototype.markVideoWatched = function (mylist, video) {
        mylist.markVideoAsWatched(video);
        this.save();
        this.onUpdateMylist.trigger({ mylist: mylist });
    };

    MylistService.prototype.save = function () {
        this.mylistsStorage.store(this.mylists);
    };

    MylistService.prototype.setEventHandlersForMylistsStorage = function () {
        var _this = this;
        this.mylistsStorage.onUpdate.addListener(function () {
            _this.mylists = _this.mylistsStorage.get();
            _this.onUpdate.trigger(null);
        });
    };

    MylistService.prototype.setEventHandlersForUpdater = function () {
        var _this = this;
        this.updater.onStartUpdatingAll.addListener(function () {
            _this.onStartUpdatingAll.trigger(null);
            _this.mylists.getMylists().forEach(function (mylist) {
                _this.onChangeMylistStatus.trigger({ mylist: mylist, status: MylistStatus.Waiting });
            });
        });
        this.updater.onStartUpdatingMylist.addListener(function (args) {
            _this.onChangeMylistStatus.trigger({ mylist: args.mylist, status: MylistStatus.Updating });
        });
        this.updater.onFailedUpdatingMylist.addListener(function (args) {
            var status = MylistStatus.Error;
            if (args.httpStatus === 403) {
                status = MylistStatus.Private;
            } else if (args.httpStatus === 404 || args.httpStatus === 410) {
                status = MylistStatus.Deleted;
            }
            _this.onChangeMylistStatus.trigger({ mylist: args.mylist, status: status });
        });
        this.updater.onFinishUpdatingMylist.addListener(function (args) {
            _this.onChangeMylistStatus.trigger({ mylist: args.mylist, status: MylistStatus.Finished });
            _this.onUpdateMylist.trigger({ mylist: args.mylist });
        });
        this.updater.onFinishUpdatingAll.addListener(function () {
            _this.save();
            _this.onFinishUpdatingAll.trigger(null);
        });
    };
    return MylistService;
})();
var ConfigSerializer = (function () {
    function ConfigSerializer() {
    }
    ConfigSerializer.prototype.unserialize = function (serialized) {
        var data = serialized.split(':');
        return new Config(parseInt(data[0], 10), parseInt(data[1], 10), data[2] !== '0', data[3] !== '0');
    };

    ConfigSerializer.prototype.serialize = function (config) {
        return [
            config.getCheckInterval().toString(),
            config.getMaxNewVideos().toString(),
            config.isCheckedListHidden() ? '1' : '0',
            config.isOrderDescendant() ? '1' : '0'
        ].join(':');
    };
    return ConfigSerializer;
})();
var util;
(function (util) {
    var OPMLOutline = (function () {
        function OPMLOutline(title, attrs) {
            this.title = title;
            this.attrs = attrs;
        }
        OPMLOutline.prototype.getOutlines = function () {
            return this.outlines;
        };

        OPMLOutline.prototype.addOutline = function (outline) {
            if (!this.outlines)
                this.outlines = [];
            this.outlines.push(outline);
        };

        OPMLOutline.prototype.toElement = function () {
            var el = document.createElement('outline');
            el.setAttribute('title', this.title);
            el.setAttribute('text', this.title);
            if (this.attrs) {
                for (var k in this.attrs) {
                    if (this.attrs.hasOwnProperty(k)) {
                        el.setAttribute(k, this.attrs[k]);
                    }
                }
            }
            if (this.outlines) {
                for (var i = 0, l = this.outlines.length; i < l; i++) {
                    el.appendChild(this.outlines[i].toElement());
                }
            }
            return el;
        };
        return OPMLOutline;
    })();
    util.OPMLOutline = OPMLOutline;

    var OPMLFeed = (function (_super) {
        __extends(OPMLFeed, _super);
        function OPMLFeed(title, htmlUrl, xmlUrl) {
            _super.call(this, title, {
                type: 'rss',
                htmlUrl: htmlUrl,
                xmlUrl: xmlUrl
            });
            this.htmlUrl = htmlUrl;
            this.xmlUrl = xmlUrl;
        }
        return OPMLFeed;
    })(OPMLOutline);
    util.OPMLFeed = OPMLFeed;

    var OPMLDocument = (function () {
        function OPMLDocument(title) {
            this.title = title;
        }
        OPMLDocument.prototype.addOutline = function (outline) {
            if (!this.outlines)
                this.outlines = [];
            this.outlines.push(outline);
        };

        OPMLDocument.prototype.toString = function () {
            var opml = document.createElement('opml');
            opml.setAttribute('version', '1.0');

            var head = document.createElement('head');
            opml.appendChild(head);

            var title = document.createElement('title');
            title.appendChild(document.createTextNode(this.title));
            head.appendChild(title);

            var dateCreated = document.createElement('dateCreated');
            dateCreated.appendChild(document.createTextNode((new Date()).toUTCString()));
            head.appendChild(dateCreated);

            var body = document.createElement('body');
            opml.appendChild(body);
            if (this.outlines) {
                this.outlines.forEach(function (outline) {
                    body.appendChild(outline.toElement());
                });
            }

            var tmp = document.createElement('div');
            tmp.appendChild(opml);
            var xml = tmp.innerHTML;

            xml = xml.replace(/ xmlurl=/g, ' xmlUrl=').replace(/ htmlurl=/g, ' htmlUrl=');

            return '<?xml version="1.0" encoding="utf-8"?>\n' + xml;
        };
        return OPMLDocument;
    })();
    util.OPMLDocument = OPMLDocument;
})(util || (util = {}));
var SettingsService = (function () {
    function SettingsService(configSerivce, mylistService) {
        this.configSerivce = configSerivce;
        this.mylistService = mylistService;
        this.onUpdate = new util.Event();
        this.onUpdateMylist = new util.Event();
        this.onImport = new util.Event();
        this.setEventHandlersForConfigService();
        this.setEventHandlersForMylistService();

        this.config = this.configSerivce.getConfig();
        this.mylists = this.mylistService.getMylistCollection();
    }
    SettingsService.prototype.setEventHandlersForConfigService = function () {
        var _this = this;
        this.configSerivce.onUpdate.addListener(function () {
            _this.config = _this.configSerivce.getConfig();
            _this.onUpdate.trigger(null);
        });
    };

    SettingsService.prototype.setEventHandlersForMylistService = function () {
        var _this = this;
        this.mylistService.onUpdate.addListener(function () {
            _this.mylists = _this.mylistService.getMylistCollection();
            _this.onUpdate.trigger(null);
        });
        this.mylistService.onUpdateMylist.addListener(function (args) {
            _this.mylists = _this.mylistService.getMylistCollection();
            _this.onUpdateMylist.trigger(args);
        });
    };

    SettingsService.prototype.getConfig = function () {
        return this.config;
    };

    SettingsService.prototype.getMylistCollection = function () {
        return this.mylists;
    };

    SettingsService.prototype.updateSettings = function (settings) {
        this.setConfigSettings(settings.configSettings);
        this.setMylistSettings(settings.mylistSettings);
    };

    SettingsService.prototype.setConfigSettings = function (settings) {
        var config = new Config(settings.checkInterval, settings.maxNewVideos, settings.hideCheckedList, settings.orderDescendant);
        this.configSerivce.setConfig(config);
    };

    SettingsService.prototype.setMylistSettings = function (settings) {
        var _this = this;
        var newMylists = [];
        settings.forEach(function (mylistSetting) {
            var mylist = _this.mylists.get(mylistSetting.mylistId);
            if (mylist) {
                mylist.setOverrideTitle(mylistSetting.title);
                newMylists.push(mylist);
            }
        });
        this.mylistService.setMylists(newMylists);
    };

    SettingsService.prototype.exportString = function () {
        var configSerializer = new ConfigSerializer();
        var configSerialized = configSerializer.serialize(this.config);

        var mylistSerializer = new MylistCollectionSerializer();
        var mylistSerialized = mylistSerializer.serialize(this.mylists);

        return configSerialized + '|' + mylistSerialized;
    };

    SettingsService.prototype.importString = function (settings) {
        var data = settings && settings.split('|');
        if (!data || data.length !== 2) {
            throw new Error('不正な形式です');
        }

        try  {
            var configSerializer = new ConfigSerializer();
            this.config = configSerializer.unserialize(data[0]);

            var mylistSerializer = new MylistCollectionSerializer();
            this.mylists = mylistSerializer.unserialize(data[1]);
        } catch (e) {
            throw new Error('インポートできません: ' + (e.message || e));
        }

        this.onUpdate.trigger(null);
        this.onImport.trigger(null);
    };

    SettingsService.prototype.exportOPML = function () {
        var opml = new util.OPMLDocument('NicoNicoFavlist Subscriptions');
        var outline = new util.OPMLOutline('NicoNicoFavlist');
        this.mylists.getMylists().forEach(function (mylist) {
            outline.addOutline(new util.OPMLFeed(mylist.getOriginalTitle(), mylist.getURL(), mylist.getFeedURL()));
        });
        opml.addOutline(outline);
        return opml.toString();
    };
    return SettingsService;
})();
var SubscriptionService = (function () {
    function SubscriptionService(mylist, mylistCollectionStorage, updateInterval) {
        this.mylist = mylist;
        this.mylistCollectionStorage = mylistCollectionStorage;
        this.updateInterval = updateInterval;
        this.onUpdate = new util.Event();
        this.mylists = this.mylistCollectionStorage.get();
        this.setEventHandlersForMylistCollectionStorage();
    }
    SubscriptionService.prototype.checkUpdate = function () {
        this.mylistCollectionStorage.checkUpdate();
    };

    SubscriptionService.prototype.isSubscribed = function () {
        return this.mylists.contains(this.mylist.getMylistId());
    };

    SubscriptionService.prototype.subscribe = function () {
        this.setSubscribed(true);
    };

    SubscriptionService.prototype.unsubscribe = function () {
        this.setSubscribed(false);
    };

    SubscriptionService.prototype.setEventHandlersForMylistCollectionStorage = function () {
        var _this = this;
        this.mylistCollectionStorage.onUpdate.addListener(function () {
            var subscribed = _this.isSubscribed();
            _this.mylists = _this.mylistCollectionStorage.get();
            if (subscribed !== _this.isSubscribed()) {
                _this.onUpdate.trigger(null);
            }
        });
    };

    SubscriptionService.prototype.setSubscribed = function (subscribed) {
        this.mylists = this.mylistCollectionStorage.get();
        if (subscribed !== this.isSubscribed()) {
            if (subscribed) {
                this.mylists.add(this.mylist);
            } else {
                this.mylists.removeById(this.mylist.getMylistId());
            }
            this.mylistCollectionStorage.store(this.mylists);
            this.updateInterval.expire();
            this.onUpdate.trigger({ mylist: this.mylist, subscribed: subscribed });
        }
    };
    return SubscriptionService;
})();
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
var NicovideoGlue;
(function (NicovideoGlue) {
    function getFavlistViewParent() {
        var $parent = $('#favlistRescueContainer, #sideContents, .column.sub').eq(0);
        if ($parent.length > 0) {
            return $('<div />').prependTo($parent);
        }

        var $rescue = Template.load(Templates.favlist_rescue);
        $rescue.appendTo(window.document.body);
        $rescue.find('.favlistRescueCaption a').click(function () {
            $rescue.toggleClass('closed');
            return false;
        });
        return $rescue.find('.favlistRescueContainer');
    }
    NicovideoGlue.getFavlistViewParent = getFavlistViewParent;

    function getSubscribeViewParent() {
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
    }
    NicovideoGlue.getSubscribeViewParent = getSubscribeViewParent;

    function createMylistFromPage() {
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
    }
    NicovideoGlue.createMylistFromPage = createMylistFromPage;
})(NicovideoGlue || (NicovideoGlue = {}));
var userscript;
(function (userscript) {
    var UserScriptSubscriptionService = (function (_super) {
        __extends(UserScriptSubscriptionService, _super);
        function UserScriptSubscriptionService(mylistCollectionStorage, updateInterval) {
            _super.call(this, NicovideoGlue.createMylistFromPage(), mylistCollectionStorage, updateInterval);
        }
        return UserScriptSubscriptionService;
    })(SubscriptionService);
    userscript.UserScriptSubscriptionService = UserScriptSubscriptionService;
})(userscript || (userscript = {}));
var userscript;
(function (userscript) {
    var DI = (function () {
        function DI() {
        }
        DI.prototype.getStorage = function () {
            return this.storage || (this.storage = util.chooseStorage());
        };

        DI.prototype.getUrlFetcher = function () {
            return this.urlFetcher || (this.urlFetcher = util.chooseUrlFetcher());
        };

        DI.prototype.getConfigStorage = function () {
            return this.configStorage || (this.configStorage = new ConfigStorage(this.getStorage()));
        };

        DI.prototype.getMylistCollectionStorage = function () {
            return this.mylistCollectionStorage || (this.mylistCollectionStorage = new MylistCollectionStorage(this.getStorage()));
        };

        DI.prototype.getMylistFeedFactory = function () {
            return this.mylistFeedFactory || (this.mylistFeedFactory = new MylistFeedFactory(this.getUrlFetcher()));
        };

        DI.prototype.getUpdateInterval = function () {
            return this.updateInterval || (this.updateInterval = new UpdateInterval(this.getStorage(), this.getConfigService()));
        };

        DI.prototype.getConfigService = function () {
            return this.configService || (this.configService = new ConfigService(this.getConfigStorage()));
        };

        DI.prototype.getMylistService = function () {
            return this.mylistService || (this.mylistService = new MylistService(this.getMylistCollectionStorage(), this.getUpdateInterval(), this.getMylistFeedFactory()));
        };

        DI.prototype.getSettingsService = function () {
            return this.settingsService || (this.settingsService = new SettingsService(this.getConfigService(), this.getMylistService()));
        };

        DI.prototype.getSubscriptionService = function () {
            return this.subscriptionService || (this.subscriptionService = new userscript.UserScriptSubscriptionService(this.getMylistCollectionStorage(), this.getUpdateInterval()));
        };
        return DI;
    })();
    userscript.DI = DI;
})(userscript || (userscript = {}));
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
var View = (function () {
    function View($el) {
        this.$el = $el;
        this.onShow = new util.Event();
        this.onHide = new util.Event();
    }
    View.prototype.appendTo = function ($parent) {
        this.$el.appendTo($parent);
    };

    View.prototype.isVisible = function () {
        return this.$el.is(':visible');
    };

    View.prototype.isHidden = function () {
        return this.$el.is(':hidden');
    };

    View.prototype.show = function () {
        this.update();
        this.$el.show();
        this.onShow.trigger(null);
    };

    View.prototype.hide = function () {
        this.$el.hide();
        this.onHide.trigger(null);
    };

    View.prototype.update = function () {
    };
    return View;
})();
var SubscribeView = (function (_super) {
    __extends(SubscribeView, _super);
    function SubscribeView(subscriptionService) {
        _super.call(this, Template.load(Templates.subscribe));
        this.subscriptionService = subscriptionService;
        this.onSubscribeRequest = new util.Event();
        this.onUnsubscribeRequest = new util.Event();
        this.setEventHandlers();
    }
    SubscribeView.prototype.update = function () {
        this.$el.toggleClass('subscribed', this.subscriptionService.isSubscribed());
    };

    SubscribeView.prototype.setEventHandlers = function () {
        this.setEventHandlersForView();
        this.setEventHandlersForSubscriptionService();
    };

    SubscribeView.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.$el.find('.favlistSubscribeButton').click(function () {
            _this.onSubscribeRequest.trigger(null);
            return false;
        });
        this.$el.find('.favlistUnsubscribeButton').click(function () {
            _this.onUnsubscribeRequest.trigger(null);
            return false;
        });
    };

    SubscribeView.prototype.setEventHandlersForSubscriptionService = function () {
        var _this = this;
        this.subscriptionService.onUpdate.addListener(function () {
            _this.update();
        });
    };
    return SubscribeView;
})(View);
var SubscribeController = (function () {
    function SubscribeController() {
        this.subscriptionService = DI.getSubscriptionService();
    }
    SubscribeController.prototype.start = function () {
        this.getView().show();
        this.observeUpdate();
    };

    SubscribeController.prototype.getView = function () {
        if (!this.subscribeView) {
            this.subscribeView = new SubscribeView(this.subscriptionService);
            this.setEventHandlersForView();
        }
        return this.subscribeView;
    };

    SubscribeController.prototype.observeUpdate = function () {
        var _this = this;
        var updateInteval = 5000;
        var checkUpdate = function () {
            _this.subscriptionService.checkUpdate();
            setTimeout(checkUpdate, updateInteval);
        };
        setTimeout(checkUpdate, updateInteval);
    };

    SubscribeController.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.subscribeView.onSubscribeRequest.addListener(function () {
            _this.subscriptionService.subscribe();
        });
        this.subscribeView.onUnsubscribeRequest.addListener(function () {
            _this.subscriptionService.unsubscribe();
        });
    };
    return SubscribeController;
})();
var Subview = (function () {
    function Subview($el) {
        this.$el = $el;
    }
    Subview.prototype.appendTo = function ($parent) {
        this.$el.appendTo($parent);
    };
    return Subview;
})();
var FavlistMylistsVideoSubview = (function (_super) {
    __extends(FavlistMylistsVideoSubview, _super);
    function FavlistMylistsVideoSubview() {
        _super.call(this, Template.load(Templates.favlist_mylists_video));
        this.onWatchVideo = new util.Event();
        this.setEventHandlers();
    }
    FavlistMylistsVideoSubview.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistVideoLink').click(function () {
            _this.onWatchVideo.trigger(null);
        });
        this.$el.find('.favlistVideoMemo').click(function () {
            _this.$el.find('.favlistVideoMemo').toggleClass('expanded');
            return false;
        });
    };

    FavlistMylistsVideoSubview.prototype.render = function (video) {
        this.$el.find('.favlistVideoLink').attr({
            href: video.getURL(),
            title: video.getTitle()
        });
        this.$el.find('.favlistVideoThumbnail img').attr('src', video.getThumbnail());
        this.$el.find('.favlistVideoTimestamp').text(ViewHelper.formatTimestamp(video.getTimestamp())).attr('title', new Date(video.getTimestamp()).toLocaleString());
        this.$el.find('.favlistVideoTitle').html(video.getTitle() || "(無題)");

        var memo = video.getMemo();
        if (memo) {
            this.$el.find('.favlistVideoMemoText').html(memo);
            this.$el.find('.favlistVideoMemo').show();
        } else {
            this.$el.find('.favlistVideoMemo').hide();
        }
    };
    return FavlistMylistsVideoSubview;
})(Subview);
var FavlistMylistsMylistSubview = (function (_super) {
    __extends(FavlistMylistsMylistSubview, _super);
    function FavlistMylistsMylistSubview() {
        _super.call(this, Template.load(Templates.favlist_mylists_mylist));
        this.onClearMylistRequest = new util.Event();
        this.onWatchMylistVideo = new util.Event();
        this.$videos = this.$el.find('.favlistMylistVideos');
        this.setEventHandlersForView();
    }
    FavlistMylistsMylistSubview.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.$el.find('.favlistMylistClearButton').click(function () {
            _this.onClearMylistRequest.trigger(null);
            return false;
        });
    };

    FavlistMylistsMylistSubview.prototype.render = function (mylist, config) {
        this.renderLink(mylist);
        this.renderTitle(mylist);
        this.renderVideos(mylist, config);
    };

    FavlistMylistsMylistSubview.prototype.renderLink = function (mylist) {
        this.$el.find('.favlistMylistLink').attr('href', mylist.getURL());
    };

    FavlistMylistsMylistSubview.prototype.renderTitle = function (mylist) {
        this.$el.find('.favlistMylistTitle').text(mylist.getTitle() || "(無題)").attr('title', mylist.getTitle());
    };

    FavlistMylistsMylistSubview.prototype.renderVideos = function (mylist, config) {
        var _this = this;
        var count = mylist.getNewCount();
        this.$el.toggleClass('hasNewVideo', count > 0);
        this.$el.find('.favlistMylistNewCount').text(count.toString());
        this.$el.find('.favlistMylistClearButton').attr('disabled', count === 0).toggleClass('disabled', count === 0);

        var videos = mylist.getNewVideos();
        var order = config.isOrderDescendant() ? 1 : -1;
        videos.sort(function (a, b) {
            return (b.getTimestamp() - a.getTimestamp()) * order;
        });
        if (config.getMaxNewVideos() > 0) {
            videos = videos.slice(0, config.getMaxNewVideos());
        }

        this.$videos.empty();
        videos.forEach(function (video) {
            var videoView = new FavlistMylistsVideoSubview();
            _this.setEventHandlersForVideoView(video, videoView);
            videoView.render(video);
            videoView.appendTo(_this.$videos);
        });
    };

    FavlistMylistsMylistSubview.prototype.setEventHandlersForVideoView = function (video, videoView) {
        var _this = this;
        videoView.onWatchVideo.addListener(function () {
            _this.onWatchMylistVideo.trigger({ video: video });
        });
    };

    FavlistMylistsMylistSubview.prototype.renderStatus = function (status) {
        switch (status) {
            case MylistStatus.Waiting:
                this.showStatus('waiting');
                break;
            case MylistStatus.Updating:
                this.showStatus('updating');
                break;
            case MylistStatus.Private:
                this.showStatus('private', true);
                break;
            case MylistStatus.Deleted:
                this.showStatus('deleted', true);
                break;
            case MylistStatus.Error:
                this.showStatus('error', true);
                break;
            case MylistStatus.Finished:
                this.hideStatus();
                break;
        }
    };

    FavlistMylistsMylistSubview.prototype.showStatus = function (status, dismiss) {
        if (typeof dismiss === "undefined") { dismiss = false; }
        var _this = this;
        this.$el.find('.favlistMylistStatus').find('span').hide().filter('.' + status).show();
        this.$el.addClass('hasStatus');

        if (this.dismissStatusTimer) {
            clearTimeout(this.dismissStatusTimer);
            this.dismissStatusTimer = null;
        }
        if (dismiss) {
            this.dismissStatusTimer = setTimeout(function () {
                _this.dismissStatusTimer = null;
                _this.hideStatus();
            }, 3000);
        }
    };

    FavlistMylistsMylistSubview.prototype.hideStatus = function () {
        var _this = this;
        this.$el.find('.favlistMylistStatus span:visible').fadeOut('slow', function () {
            _this.$el.removeClass('hasStatus');
        });
    };
    return FavlistMylistsMylistSubview;
})(Subview);
var FavlistMylistsView = (function (_super) {
    __extends(FavlistMylistsView, _super);
    function FavlistMylistsView(configService, mylistService) {
        _super.call(this, Template.load(Templates.favlist_mylists));
        this.configService = configService;
        this.mylistService = mylistService;
        this.onUpdateAllMylistsRequest = new util.Event();
        this.onClearMylistRequest = new util.Event();
        this.onWatchMylistVideo = new util.Event();
        this.mylistViews = {};
        this.$mylists = this.$el.find('.favlistMylists');
        this.setEventHandlers();
    }
    FavlistMylistsView.prototype.setEventHandlers = function () {
        this.setEventHandlersForView();
        this.setEventHandlersForConfigService();
        this.setEventHandlersForMylistService();
    };

    FavlistMylistsView.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.$el.find('.favlistCheckNowButton').click(function () {
            _this.onUpdateAllMylistsRequest.trigger(null);
            return false;
        });
    };

    FavlistMylistsView.prototype.setEventHandlersForConfigService = function () {
        var _this = this;
        this.configService.onUpdate.addListener(function () {
            if (_this.isHidden())
                return;
            _this.update();
        });
    };

    FavlistMylistsView.prototype.setEventHandlersForMylistService = function () {
        var _this = this;
        this.mylistService.onUpdate.addListener(function () {
            if (_this.isHidden())
                return;
            _this.update();
        });
        this.mylistService.onUpdateMylist.addListener(function (args) {
            if (_this.isHidden())
                return;
            var mylistView = _this.mylistViews[args.mylist.getMylistId().toString()];
            if (mylistView) {
                mylistView.render(args.mylist, _this.configService.getConfig());
            }
        });
        this.mylistService.onStartUpdatingAll.addListener(function () {
            _this.$el.find('.favlistCheckNowButton').attr('disabled', true).addClass('disabled');
        });
        this.mylistService.onChangeMylistStatus.addListener(function (args) {
            var mylistView = _this.mylistViews[args.mylist.getMylistId().toString()];
            if (mylistView) {
                mylistView.renderStatus(args.status);
            }
        });
        this.mylistService.onFinishUpdatingAll.addListener(function () {
            _this.$el.find('.favlistCheckNowButton').removeAttr('disabled').removeClass('disabled');
        });
    };

    FavlistMylistsView.prototype.update = function () {
        var _this = this;
        var mylists = this.mylistService.getMylistCollection().getMylists();
        var config = this.configService.getConfig();

        this.$el.toggleClass('noMylist', mylists.length === 0);
        this.$el.toggleClass('checkedMylistHidden', config.isCheckedListHidden());

        this.mylistViews = {};
        this.$mylists.empty();
        mylists.forEach(function (mylist) {
            var mylistId = mylist.getMylistId().toString();
            var mylistView = new FavlistMylistsMylistSubview();
            _this.setEventHandlersForMylistView(mylist, mylistView);
            mylistView.render(mylist, config);
            mylistView.appendTo(_this.$mylists);
            _this.mylistViews[mylistId] = mylistView;
        });
    };

    FavlistMylistsView.prototype.setEventHandlersForMylistView = function (mylist, mylistView) {
        var _this = this;
        mylistView.onClearMylistRequest.addListener(function () {
            _this.onClearMylistRequest.trigger({ mylist: mylist });
        });
        mylistView.onWatchMylistVideo.addListener(function (args) {
            _this.onWatchMylistVideo.trigger({ mylist: mylist, video: args.video });
        });
    };
    return FavlistMylistsView;
})(View);
var FavlistSettingsMylistSubview = (function (_super) {
    __extends(FavlistSettingsMylistSubview, _super);
    function FavlistSettingsMylistSubview() {
        _super.call(this, Template.load(Templates.favlist_settings_mylist));
        this.onMove = new util.Event();
        this.onRemoved = new util.Event();
        this.setEventHandlersForView();
    }
    FavlistSettingsMylistSubview.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.$el.find('.favlistMylistMoveUpButton').click(function () {
            var $prev = _this.$el.prev();
            if ($prev.length > 0) {
                _this.$el.insertBefore($prev);
                _this.onMove.trigger(null);
            }
        });
        this.$el.find('.favlistMylistMoveDownButton').click(function () {
            var $next = _this.$el.next();
            if ($next.length > 0) {
                _this.$el.insertAfter($next);
                _this.onMove.trigger(null);
            }
        });
        this.$el.find('.favlistMylistMoveTopButton').click(function () {
            _this.$el.parent().prepend(_this.$el);
            _this.onMove.trigger(null);
        });
        this.$el.find('.favlistMylistRemoveButton').click(function () {
            _this.$el.remove();
            _this.onRemoved.trigger(null);
        });
    };

    FavlistSettingsMylistSubview.prototype.render = function (mylist) {
        this.$el.data('mylistId', mylist.getMylistId());
        this.$el.data('searchString', this.makeSearchString(mylist));
        this.$el.find('.favlistMylistLink').attr('href', mylist.getURL());
        this.$el.find('.favlistMylistTitleEdit').val(mylist.getTitle()).attr('placeholder', mylist.getOriginalTitle());
    };

    FavlistSettingsMylistSubview.prototype.makeSearchString = function (mylist) {
        return [
            mylist.getOriginalTitle(),
            mylist.getOverrideTitle(),
            mylist.getURL()
        ].join("\n").replace(/[ \t\u3000]+/g, "").toLowerCase();
    };

    FavlistSettingsMylistSubview.prototype.getIndex = function () {
        return this.$el.prevAll().length;
    };

    FavlistSettingsMylistSubview.prototype.hasMylistId = function (mylistId) {
        var id = this.$el.data('mylistId');
        return (id && id.equalTo(mylistId));
    };

    FavlistSettingsMylistSubview.prototype.toggleByFilter = function (filter) {
        if (filter === '') {
            this.$el.removeClass('filtering');
            this.$el.show();
            return;
        }

        this.$el.addClass('filtering');
        var searchString = this.$el.data('searchString') || '';
        if (searchString.indexOf(filter) >= 0) {
            this.$el.show();
        } else {
            this.$el.hide();
        }
    };

    FavlistSettingsMylistSubview.prototype.updateButtons = function () {
        var filtering = this.$el.hasClass('filtering');
        var isFirst = this.$el.is(':first-child');
        var isLast = this.$el.is(':last-child');

        this.$el.find('.favlistMylistMoveUpButton').attr('disabled', isFirst || filtering);
        this.$el.find('.favlistMylistMoveDownButton').attr('disabled', isLast || filtering);
        this.$el.find('.favlistMylistMoveTopButton').attr('disabled', isFirst || filtering);
    };

    FavlistSettingsMylistSubview.prototype.getMylistSetting = function () {
        var mylistId = this.$el.data('mylistId');
        if (!mylistId) {
            throw new Error('保存中にエラーが発生しました');
        }

        var title = this.$el.find('.favlistMylistTitleEdit').val();
        return { mylistId: mylistId, title: title };
    };
    return FavlistSettingsMylistSubview;
})(Subview);
var FavlistSettingsView = (function (_super) {
    __extends(FavlistSettingsView, _super);
    function FavlistSettingsView(settingsService) {
        _super.call(this, Template.load(Templates.favlist_settings));
        this.settingsService = settingsService;
        this.onSave = new util.Event();
        this.onCancel = new util.Event();
        this.onImportRequest = new util.Event();
        this.onImportApply = new util.Event();
        this.onImportCancel = new util.Event();
        this.onExportRequest = new util.Event();
        this.onExportClose = new util.Event();
        this.onOPMLExportRequest = new util.Event();
        this.$mylists = this.$el.find('.favlistSettingMylists');
        this.setEventHandlers();
    }
    FavlistSettingsView.prototype.setEventHandlers = function () {
        this.setEventHandlersForView();
        this.setEventHandlersForSettingsService();
    };

    FavlistSettingsView.prototype.setEventHandlersForView = function () {
        var _this = this;
        var escapeHandler;
        this.onShow.addListener(function () {
            if (!escapeHandler) {
                escapeHandler = function (event) {
                    if ((event).keyCode === 27)
                        _this.onCancel.trigger(null);
                };
                $(window.document).bind('keyup', escapeHandler);
            }
            _this.$el.find('.favlistSettingsMainPage').show();
            _this.$el.find('.favlistSettingsEditorPage').hide();
        });
        this.onHide.addListener(function () {
            if (escapeHandler) {
                $(window.document).unbind('keyup', escapeHandler);
                escapeHandler = null;
            }
        });

        this.$el.find('.favlistSettingMylistSearchEdit').keyup(function () {
            _this.filterMylists(_this.$el.find('.favlistSettingMylistSearchEdit').val());
        });

        this.$el.find('.favlistSaveSettingsButton').click(function () {
            _this.onSave.trigger({
                mylistSettings: _this.getMylistSettings(),
                configSettings: _this.getConfigSettings()
            });
            return false;
        });
        this.$el.find('.favlistCancelSettingsButton').click(function () {
            _this.onCancel.trigger(null);
            return false;
        });

        this.$el.find('.favlistSettingsImportLink').click(function () {
            _this.onImportRequest.trigger(null);
            return false;
        });
        this.$el.find('.favlistSettingsExportLink').click(function () {
            _this.onExportRequest.trigger(null);
            return false;
        });
        this.$el.find('.favlistSettingsOPMLExportLink').click(function () {
            _this.onOPMLExportRequest.trigger(null);
            return false;
        });

        this.$el.find('.favlistSettingsEditorForm textarea').click(function () {
            this.select();
        });
        this.$el.find('.favlistImportApplyButton').click(function () {
            _this.onImportApply.trigger({ importSetting: _this.$el.find('.favlistSettingsImportEditor').val() });
            return false;
        });
        this.$el.find('.favlistImportCancelButton').click(function () {
            _this.onImportCancel.trigger(null);
            return false;
        });
        this.$el.find('.favlistExportCloseButton').click(function () {
            _this.onExportClose.trigger(null);
            return false;
        });
    };

    FavlistSettingsView.prototype.setEventHandlersForSettingsService = function () {
        var _this = this;
        this.settingsService.onUpdate.addListener(function () {
            if (_this.isHidden())
                return;
            _this.update();
        });
        this.settingsService.onUpdateMylist.addListener(function (args) {
            if (_this.isHidden())
                return;
            var mylistId = args.mylist.getMylistId();
            _this.mylistViews.forEach(function (view) {
                if (view.hasMylistId(mylistId)) {
                    view.render(args.mylist);
                }
            });
        });
        this.settingsService.onImport.addListener(function () {
            alert("設定をインポートして設定画面に反映しました。\n設定内容をご確認の上、問題なければ「設定を保存」してください。");
        });
    };

    FavlistSettingsView.prototype.showImportPage = function () {
        this.$el.find('.favlistSettingsImportEditor').val('');
        this.$el.find('.favlistSettingsMainPage').slideUp();
        this.$el.find('.favlistSettingsEditorPage').removeClass('exporting').addClass('importing').slideDown();
    };

    FavlistSettingsView.prototype.showExportPage = function (settings) {
        this.$el.find('.favlistSettingsExportEditor').val(settings);

        var dataURI = 'data:application/octet-stream,' + encodeURIComponent(settings);
        this.$el.find('.favlistSettingsDownloadExportLink').attr('href', dataURI);

        this.$el.find('.favlistSettingsMainPage').slideUp();
        this.$el.find('.favlistSettingsEditorPage').removeClass('importing').addClass('exporting').slideDown();
    };

    FavlistSettingsView.prototype.exportOPML = function (opml) {
        var dataURI = 'data:text/xml;charset=utf-8,' + encodeURIComponent(opml);
        window.open(dataURI, '_blank');
    };

    FavlistSettingsView.prototype.returnToMainPage = function () {
        this.$el.find('.favlistSettingsEditorPage').slideUp();
        this.$el.find('.favlistSettingsMainPage').slideDown();
    };

    FavlistSettingsView.prototype.showError = function (error) {
        alert(error.message || error);
    };

    FavlistSettingsView.prototype.filterMylists = function (filter) {
        filter = filter.replace(/[ \t\u3000]+/g, "").toLowerCase();
        this.mylistViews.forEach(function (view) {
            return view.toggleByFilter(filter);
        });
        this.updateMylistButtons();
    };

    FavlistSettingsView.prototype.getMylistSettings = function () {
        var settings = new Array(this.mylistViews.length);
        this.mylistViews.forEach(function (view) {
            settings[view.getIndex()] = view.getMylistSetting();
        });
        return settings;
    };

    FavlistSettingsView.prototype.getConfigSettings = function () {
        return {
            checkInterval: parseInt(this.$el.find('.favlistConfigCheckInterval').val(), 10),
            maxNewVideos: parseInt(this.$el.find('.favlistConfigMaxNewVideos').val(), 10),
            hideCheckedList: this.$el.find('.favlistConfigHideCheckedList').is(':checked'),
            orderDescendant: this.$el.find('.favlistConfigOrderDescendant').is(':checked')
        };
    };

    FavlistSettingsView.prototype.update = function () {
        this.updateMylistViews();
        this.updateConfigView();
    };

    FavlistSettingsView.prototype.updateMylistViews = function () {
        var _this = this;
        var mylists = this.settingsService.getMylistCollection().getMylists();

        this.mylistViews = [];
        this.$mylists.empty();
        mylists.forEach(function (mylist) {
            var mylistView = new FavlistSettingsMylistSubview();
            _this.setEventHandlersForMylistView(mylist, mylistView);
            mylistView.render(mylist);
            mylistView.appendTo(_this.$mylists);
            _this.mylistViews.push(mylistView);
        });

        this.$el.find('.favlistSettingMylistSearchEdit').val('');
        this.updateMylistButtons();
    };

    FavlistSettingsView.prototype.setEventHandlersForMylistView = function (mylist, mylistView) {
        var _this = this;
        mylistView.onMove.addListener(function () {
            _this.updateMylistButtons();
        });
        mylistView.onRemoved.addListener(function () {
            var index = _this.mylistViews.indexOf(mylistView);
            if (index >= 0) {
                _this.mylistViews.splice(index, 1);
            }
            _this.updateMylistButtons();
        });
    };

    FavlistSettingsView.prototype.updateMylistButtons = function () {
        this.mylistViews.forEach(function (view) {
            return view.updateButtons();
        });
    };

    FavlistSettingsView.prototype.updateConfigView = function () {
        var config = this.settingsService.getConfig();
        this.$el.find('.favlistConfigCheckInterval').val(config.getCheckInterval().toString());
        this.$el.find('.favlistConfigMaxNewVideos').val(config.getMaxNewVideos().toString());
        this.$el.find('.favlistConfigHideCheckedList').attr('checked', config.isCheckedListHidden());
        this.$el.find('.favlistConfigOrderDescendant').attr('checked', config.isOrderDescendant());
    };
    return FavlistSettingsView;
})(View);
var FavlistView = (function (_super) {
    __extends(FavlistView, _super);
    function FavlistView() {
        _super.call(this, Template.load(Templates.favlist));
        this.onSettingPageRequest = new util.Event();
        this.setEventHandlers();
    }
    FavlistView.prototype.setMylistsView = function (view) {
        this.mylistsView = view;
        this.mylistsView.hide();
        this.mylistsView.appendTo(this.$el);
    };

    FavlistView.prototype.setSettingsView = function (view) {
        this.settingsView = view;
        this.settingsView.hide();
        this.settingsView.appendTo(this.$el);
    };

    FavlistView.prototype.showMylistsPage = function () {
        if (!this.mylistsView) {
            throw new Error('MylistsView is not set');
        }
        if (this.settingsView && this.settingsView.isVisible()) {
            this.settingsView.hide();
        }
        this.mylistsView.show();
    };

    FavlistView.prototype.showSettingsPage = function () {
        if (!this.settingsView) {
            throw new Error('SettingsView is not set');
        }
        this.settingsView.show();
    };

    FavlistView.prototype.setEventHandlers = function () {
        var _this = this;
        this.$el.find('.favlistSettingButton').click(function () {
            _this.onSettingPageRequest.trigger(null);
            return false;
        });
    };
    return FavlistView;
})(View);
var FavlistMylistsController = (function () {
    function FavlistMylistsController() {
        this.configService = DI.getConfigService();
        this.mylistService = DI.getMylistService();
    }
    FavlistMylistsController.prototype.getView = function () {
        if (!this.mylistsView) {
            this.mylistsView = new FavlistMylistsView(this.configService, this.mylistService);
            this.setEventHandlersForView();
        }
        return this.mylistsView;
    };

    FavlistMylistsController.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.mylistsView.onShow.addListener(function () {
            _this.mylistService.updateAllIfExpired();
        });
        this.mylistsView.onUpdateAllMylistsRequest.addListener(function () {
            _this.mylistService.updateAll();
        });
        this.mylistsView.onClearMylistRequest.addListener(function (args) {
            _this.mylistService.markMylistAllWatched(args.mylist);
        });
        this.mylistsView.onWatchMylistVideo.addListener(function (args) {
            _this.mylistService.markVideoWatched(args.mylist, args.video);
        });
    };
    return FavlistMylistsController;
})();
var FavlistSettingsController = (function () {
    function FavlistSettingsController() {
        this.onFinish = new util.Event();
        this.settingsService = DI.getSettingsService();
    }
    FavlistSettingsController.prototype.getView = function () {
        if (!this.settingsView) {
            this.settingsView = new FavlistSettingsView(this.settingsService);
            this.setEventHandlersForView();
        }
        return this.settingsView;
    };

    FavlistSettingsController.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.settingsView.onSave.addListener(function (args) {
            try  {
                _this.settingsService.updateSettings(args);
            } catch (e) {
                _this.settingsView.showError(e);
                return;
            }
            _this.onFinish.trigger(null);
        });

        this.settingsView.onCancel.addListener(function () {
            _this.onFinish.trigger(null);
        });

        this.settingsView.onImportRequest.addListener(function () {
            _this.settingsView.showImportPage();
        });

        this.settingsView.onExportRequest.addListener(function () {
            _this.settingsView.showExportPage(_this.settingsService.exportString());
        });

        this.settingsView.onImportApply.addListener(function (args) {
            try  {
                _this.settingsService.importString(args.importSetting);
            } catch (e) {
                _this.settingsView.showError(e);
                return;
            }
            _this.settingsView.returnToMainPage();
        });

        this.settingsView.onImportCancel.addListener(function () {
            _this.settingsView.returnToMainPage();
        });

        this.settingsView.onExportClose.addListener(function () {
            _this.settingsView.returnToMainPage();
        });

        this.settingsView.onOPMLExportRequest.addListener(function () {
            _this.settingsView.exportOPML(_this.settingsService.exportOPML());
        });
    };
    return FavlistSettingsController;
})();
var FavlistController = (function () {
    function FavlistController() {
        this.configService = DI.getConfigService();
        this.mylistService = DI.getMylistService();
    }
    FavlistController.prototype.start = function () {
        this.getView().show();
        this.observeUpdate();
    };

    FavlistController.prototype.getView = function () {
        if (!this.favlistView) {
            this.favlistView = new FavlistView();
            this.setEventHandlersForView();
        }
        return this.favlistView;
    };

    FavlistController.prototype.observeUpdate = function () {
        var _this = this;
        var updateInteval = 5000;
        var checkUpdate = function () {
            _this.configService.checkUpdate();
            _this.mylistService.checkUpdate();
            setTimeout(checkUpdate, updateInteval);
        };
        setTimeout(checkUpdate, updateInteval);
    };

    FavlistController.prototype.setEventHandlersForView = function () {
        var _this = this;
        this.favlistView.onShow.addListener(function () {
            _this.showMylistsPage();
        });
        this.favlistView.onSettingPageRequest.addListener(function () {
            _this.showSettingsPage();
        });
    };

    FavlistController.prototype.showMylistsPage = function () {
        if (!this.mylistsController) {
            this.mylistsController = new FavlistMylistsController();
            this.favlistView.setMylistsView(this.mylistsController.getView());
        }
        this.favlistView.showMylistsPage();
    };

    FavlistController.prototype.showSettingsPage = function () {
        var _this = this;
        if (!this.settingsController) {
            this.settingsController = new FavlistSettingsController();
            this.settingsController.onFinish.addListener(function () {
                return _this.showMylistsPage();
            });
            this.favlistView.setSettingsView(this.settingsController.getView());
        }
        this.favlistView.showSettingsPage();
    };
    return FavlistController;
})();
var userscript;
(function (userscript) {
    var UserScriptApp = (function () {
        function UserScriptApp() {
        }
        UserScriptApp.prototype.start = function () {
            try  {
                this.route();
            } catch (e) {
                console.error('[NicoNicoFavlist] Error: ' + (e.message || e));
            }
        };

        UserScriptApp.prototype.route = function () {
            if (/rss=/.test(window.location.search)) {
                return;
            }

            var path = window.location.pathname;
            if (/^\/mylist|^\/user/.test(path)) {
                this.subscription();
            } else if (/^\/$|^\/video_top/.test(path)) {
                this.favlist();
            }
        };

        UserScriptApp.prototype.subscription = function () {
            var controller = new SubscribeController();
            controller.getView().appendTo(NicovideoGlue.getSubscribeViewParent());
            controller.start();
        };

        UserScriptApp.prototype.favlist = function () {
            var controller = new FavlistController();
            controller.getView().appendTo(NicovideoGlue.getFavlistViewParent());
            controller.start();
        };
        return UserScriptApp;
    })();
    userscript.UserScriptApp = UserScriptApp;
})(userscript || (userscript = {}));
var DI = new userscript.DI();

$(function () {
    var app = new userscript.UserScriptApp();
    app.start();
});

})(jQuery);
