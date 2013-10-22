/// <reference path="../IFavlistDI.ts" />

interface IFavlistApp {
    start();
}

class FavlistApp implements IFavlistApp {

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
            DI.resolve('SubscribeController').start();
        } else if (/^\/$|^\/video_top/.test(path)) {
            DI.resolve('FavlistController').start();
        }
    }

}
