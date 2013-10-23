/// <reference path="../view/FavlistView.ts" />
/// <reference path="./NicovideoGlue.ts" />

class NicovideoFavlistView extends FavlistView {

    constructor() {
        super();
        this.appendTo(NicovideoGlue.getFavlistViewParent());
    }

}
