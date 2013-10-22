/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="../../typings/greasemonkey.d.ts" />

enum Templates {
    favlist,
    favlist_rescue,

    favlist_mylists,
    favlist_mylists_mylist,
    favlist_mylists_video,

    favlist_settings,
    favlist_settings_mylist,

    subscribe,
    subscribe_rescue,
}

module Template {

    export declare var html: {
        [name: string]: string;
    };
    export declare var css: {
        [name: string]: string;
    };

    var loadedCSS: { [name: string]: boolean } = {};

    export function load(template: Templates): JQuery {
        var name = Templates[template];
        if (typeof html[name] === 'undefined') {
            throw new Error('No such template');
        }

        if (typeof css[name] !== 'undefined' && !loadedCSS[name]) {
            addCSS(css[name]);
            loadedCSS[name] = true;
        }

        return $(html[name]);
    }

    function addCSS(css: string) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            $('<style />').attr('type', 'text/css').html(css).appendTo($('head').eq(0));
        }
    }

}
