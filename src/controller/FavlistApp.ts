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
        if (/rss=/.test(location.search)) {
            return;
        }

        var path = location.pathname;
        if (/^\/mylist|^\/user/.test(path)) {
            (new RegisterController()).start();
        } else if (/^\/$|^\/video_top/.test(path)) {
            (new FavlistController()).start();
        }
    }

}
