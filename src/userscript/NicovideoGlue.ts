/// <reference path="../../typings/jquery.d.ts" />
/// <reference path="../view/Template.ts" />
/// <reference path="../model/Mylist.ts" />

module NicovideoGlue {

    export function getFavlistViewParent(): JQuery {
        var $parent: JQuery = $('#favlistRescueContainer, #sideContents, .column.sub').eq(0);
        if ($parent.length > 0) {
            return $('<div />').prependTo($parent);
        }

        var $rescue = Template.load(Templates.favlist_rescue);
        $rescue.appendTo(window.document.body);
        $rescue.find('.favlistRescueCaption a').click(() => {
            $rescue.toggleClass('closed');
            return false;
        });
        return $rescue.find('#favlistRescueContainer');
    }

    export function getSubscribeViewParent(): JQuery {
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

    export function createMylistFromPage(): Mylist {
        var mylistId: MylistId = MylistId.fromURL(window.location.href);
        var title: string;

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

}
