/// <reference path="../IFavlistDI.ts" />
/// <reference path="../controller/SubscribeController.ts" />
/// <reference path="../controller/FavlistController.ts" />
/// <reference path="./NicovideoGlue.ts" />

module userscript {

    export class UserScriptApp {

        start() {
            try {
                this.route();
            } catch (e) {
                console.error('[NicoNicoFavlist] Error: ' + (e.message || e));
            }
        }

        private route() {
            if (/rss=/.test(window.location.search)) {
                return;
            }

            var path = window.location.pathname;
            if (/^\/mylist|^\/user/.test(path)) {
                this.subscription();
            } else if (/^\/$|^\/video_top/.test(path)) {
                this.favlist();
            }
        }

        private subscription() {
            var controller = new SubscribeController();
            controller.getView().appendTo(NicovideoGlue.getSubscribeViewParent());
            controller.start();
        }

        private favlist() {
            var controller = new FavlistController();
            controller.getView().appendTo(NicovideoGlue.getFavlistViewParent());
            controller.start();
        }

    }

}
