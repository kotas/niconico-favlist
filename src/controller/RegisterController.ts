/// <reference path="../util/Storage.ts" />
/// <reference path="../model/MylistCollectionStorage.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/UpdateInterval.ts" />
/// <reference path="../view/RegisterView.ts" />

class RegisterController {

    private storage: util.IStorage;
    private mylistCollectionStorage: MylistCollectionStorage;
    private mylistCollection: MylistCollection;
    private updateInterval: UpdateInterval;
    private registerView: RegisterView;
    private mylist: Mylist;

    constructor() {
        this.storage = util.chooseStorage();
        this.mylistCollectionStorage = new MylistCollectionStorage(this.storage);
        this.updateInterval = new UpdateInterval(this.storage, 0);
        this.registerView = new RegisterView();
        this.mylist = this.createMylistFromPage();
        this.setEventHandlers();
    }

    start() {
        this.reloadMylistCollection();
        this.registerView.show();
    }

    private reloadMylistCollection() {
        this.mylistCollection = this.mylistCollectionStorage.get();
        this.registerView.setRegistered(this.mylistIsRegistered());
    }

    private mylistIsRegistered(): boolean {
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

    private setEventHandlers() {
        this.registerView.addListener('registerRequest', () => {
            this.reloadMylistCollection();
            if (!this.mylistIsRegistered()) {
                this.mylistCollection.add(this.mylist);
                this.mylistCollectionStorage.store(this.mylistCollection);
                this.updateInterval.expire();
                this.registerView.setRegistered(true);
            }
        });
        this.registerView.addListener('unregisterRequest', () => {
            this.reloadMylistCollection();
            if (this.mylistIsRegistered()) {
                this.mylistCollection.removeById(this.mylist.getMylistId());
                this.mylistCollectionStorage.store(this.mylistCollection);
                this.updateInterval.expire();
                this.registerView.setRegistered(false);
            }
        });
    }

}
