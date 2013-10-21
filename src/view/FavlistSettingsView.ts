/// <reference path="./View.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/Config.ts" />

class FavlistSettingsView extends View {

    constructor(
        private config: IConfig,
        $parent: JQuery,
        private mylistCollection: MylistCollection
    ) {
        super($parent, Template.load(Templates.favlist_settings));
        this.update();
    }

    setMylistCollection(mylistCollection: MylistCollection) {
        if (this.mylistCollection !== mylistCollection) {
            this.mylistCollection = mylistCollection;
            this.updateMylistViews();
        }
    }

    setConfig(config: Config) {
        if (this.config !== config) {
            this.config = config;
            this.updateConfigView();
        }
    }

    update() {
        this.updateMylistViews();
        this.updateConfigView();
    }

    private updateMylistViews() {

    }

    private updateConfigView() {

    }

}
