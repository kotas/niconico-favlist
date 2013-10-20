/// <reference path="./RegisterController.ts" />
/// <reference path="./FavlistController.ts" />

class FavlistApp {

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
            (new RegisterController()).start();
        } else if (/^\/$|^\/video_top/.test(path)) {
            (new FavlistController()).start();
        }
    }

}
