/// <reference path="./View.ts" />
/// <reference path="../model/MylistCollection.ts" />
/// <reference path="../model/Config.ts" />

interface IFavlistSettingSavedMylist {
    mylistId: MylistId;
    title: string;
}

/**
 * events:
 *   - settingSave(savedMylists: IFavlistSettingSavedMylist[], savedConfig: IConfig)
 *   - settingCancel()
 */
class FavlistSettingsView extends View {

    private $mylists: JQuery;

    constructor(
        $parent: JQuery,
        private config: IConfig,
        private mylistCollection: MylistCollection
    ) {
        super($parent, Template.load(Templates.favlist_settings));
        this.$mylists = this.$el.find('.favlistSettingMylists');
        this.setEventHandlers();
    }

    update() {
        this.updateMylistViews();
        this.updateConfigView();
    }

    private setEventHandlers() {
        this.$el.find('.favlistSaveSettingsButton').click(() => {
            try {
                var mylists = this.getSavedMylists();
                var config = this.getSavedConfig();
            } catch (e) {
                alert(e.message || e);
                return false;
            }
            this.emitEvent('settingSave', [mylists, config]);
            return false;
        });
        this.$el.find('.favlistCancelSettingsButton').click(() => {
            this.emitEvent('settingCancel');
            return false;
        });
    }

    private getSavedMylists(): IFavlistSettingSavedMylist[] {
        var savedMylists: IFavlistSettingSavedMylist[] = [];
        this.$mylists.children().each((i, el) => {
            var $mylist = $(el);
            var mylistId: MylistId = $mylist.data('mylistId');
            if (!mylistId) {
                throw new Error('保存中にエラーが発生しました');
            }
            var title: string = $mylist.find('.favlistMylistTitleEdit').val();
            savedMylists.push({ mylistId: mylistId, title: title });
        });
        return savedMylists;
    }

    private getSavedConfig(): IConfig {
        var checkInterval: number = parseInt(this.$el.find('.favlistConfigCheckInterval').val(), 10);
        if (isNaN(checkInterval)) {
            throw new Error('更新チェック間隔は整数で指定してください');
        }

        var maxNewVideos: number = parseInt(this.$el.find('.favlistConfigMaxNewVideos').val(), 10);
        if (isNaN(maxNewVideos)) {
            throw new Error('新着動画の表示数は整数で指定してください');
        }

        var hideCheckedList: boolean = this.$el.find('.favlistConfigHideCheckedList').is(':checked');
        var orderDescendant: boolean = this.$el.find('.favlistConfigOrderDescendant').is(':checked');

        return new Config(
            checkInterval,
            maxNewVideos,
            hideCheckedList,
            orderDescendant
        );
    }

    private updateMylistViews() {
        var $template = $(Template.load(Templates.favlist_settings_mylist));

        this.$mylists.empty();
        this.mylistCollection.getMylists().forEach((mylist: Mylist) => {
            var $mylist = $template.clone();
            $mylist.data('mylistId', mylist.getMylistId());
            $mylist.find('.favlistMylistTitleEdit').val(mylist.getOverrideTitle() || mylist.getOriginalTitle());
            this.setEventHandlersForMylistView($mylist);
            this.$mylists.append($mylist);
        });
        this.updateMylistButtons();
    }

    private updateMylistButtons() {
        var $mylists = this.$mylists.children();
        var total = $mylists.length;
        $mylists.each((i, el) => {
            var $mylist = $(el);
            $mylist.find('.favlistMylistMoveUpButton').attr('disabled', (i === 0));
            $mylist.find('.favlistMylistMoveDownButton').attr('disabled', (i === total - 1));
            $mylist.find('.favlistMylistMoveTopButton').attr('disabled', (i === 0));
        });
    }

    private setEventHandlersForMylistView($mylist: JQuery) {
        $mylist.find('.favlistMylistMoveUpButton').click(() => {
            var $prev = $mylist.prev();
            if ($prev.length > 0) {
                $mylist.insertBefore($prev);
                this.updateMylistButtons();
            }
        });
        $mylist.find('.favlistMylistMoveDownButton').click(() => {
            var $next = $mylist.next();
            if ($next.length > 0) {
                $mylist.insertAfter($next);
                this.updateMylistButtons();
            }
        });
        $mylist.find('.favlistMylistMoveTopButton').click(() => {
            $mylist.parent().prepend($mylist);
            this.updateMylistButtons();
        });
        $mylist.find('.favlistMylistRemoveButton').click(() => {
            $mylist.remove();
            this.updateMylistButtons();
        });
    }

    private updateConfigView() {
        this.$el.find('.favlistConfigCheckInterval').val(this.config.getCheckInterval().toString());
        this.$el.find('.favlistConfigMaxNewVideos').val(this.config.getMaxNewVideos().toString());
        this.$el.find('.favlistConfigHideCheckedList').attr('checked', this.config.isCheckedListHidden());
        this.$el.find('.favlistConfigOrderDescendant').attr('checked', this.config.isOrderDescendant());
    }

}
