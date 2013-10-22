/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../view/SubscribeView.ts" />

interface ISubscribeController {
    start();
}

class SubscribeController implements ISubscribeController {

    private mylistCollection: MylistCollection;
    private subscribeView: SubscribeView;
    private mylist: Mylist;

    constructor(
        private mylistCollectionStorage: IMylistCollectionStorage,
        private updateInterval: IUpdateInterval
    ) {
        this.subscribeView = new SubscribeView();
        this.mylist = this.createMylistFromPage();
        this.setEventHandlers();
    }

    start() {
        this.reloadMylistCollection();
        this.subscribeView.show();
    }

    private setEventHandlers() {
        this.subscribeView.addListener('subscribeRequest', () => {
            this.subscribe();
        });
        this.subscribeView.addListener('unsubscribeRequest', () => {
            this.unsubscribe();
        });
    }

    private subscribe() {
        this.reloadMylistCollection();
        if (!this.mylistIsSubscribed()) {
            this.mylistCollection.add(this.mylist);
            this.mylistCollectionStorage.store(this.mylistCollection);
            this.updateInterval.expire();
            this.subscribeView.setSubscribed(true);
        }
    }

    private unsubscribe() {
        this.reloadMylistCollection();
        if (this.mylistIsSubscribed()) {
            this.mylistCollection.removeById(this.mylist.getMylistId());
            this.mylistCollectionStorage.store(this.mylistCollection);
            this.updateInterval.expire();
            this.subscribeView.setSubscribed(false);
        }
    }

    private reloadMylistCollection() {
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.subscribeView.setSubscribed(this.mylistIsSubscribed());
    }

    private mylistIsSubscribed(): boolean {
        return this.mylistCollection.contains(this.mylist.getMylistId());
    }

    private createMylistFromPage(): Mylist {
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
