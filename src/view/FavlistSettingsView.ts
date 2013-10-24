/// <reference path="./View.ts" />
/// <reference path="../service/ConfigService.ts" />
/// <reference path="../service/MylistService.ts" />

class FavlistSettingsView extends View {

    onSave = new util.Event<{ mylistSettings: IMylistSetting[]; configSettings: IConfig }>();
    onCancel = new util.Event<void>();

    private $mylists: JQuery;

    constructor(
        private configService: IConfigService,
        private mylistService: IMylistService
    ) {
        super(Template.load(Templates.favlist_settings));
        this.$mylists = this.$el.find('.favlistSettingMylists');
        this.setEventHandlersForView();
    }

    private setEventHandlersForView() {
        this.$el.find('.favlistSaveSettingsButton').click(() => {
            try {
                var mylistSettings = this.getMylistSettings();
                var configSettings = this.getConfigSettings();
            } catch (e) {
                alert(e.message || e);
                return false;
            }
            this.onSave.trigger({ mylistSettings: mylistSettings, configSettings: configSettings });
            return false;
        });
        this.$el.find('.favlistCancelSettingsButton').click(() => {
            this.onCancel.trigger(null);
            return false;
        });
    }

    private getMylistSettings(): IMylistSetting[] {
        var savedMylists: IMylistSetting[] = [];
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

    private getConfigSettings(): IConfig {
        var checkInterval: number = parseInt(this.$el.find('.favlistConfigCheckInterval').val(), 10);
        if (isNaN(checkInterval) || checkInterval < 0) {
            throw new Error('更新チェック間隔は正の整数で指定してください');
        }

        var maxNewVideos: number = parseInt(this.$el.find('.favlistConfigMaxNewVideos').val(), 10);
        if (isNaN(maxNewVideos) || checkInterval < 0) {
            throw new Error('新着動画の表示数は正の整数で指定してください');
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

    update() {
        this.updateMylistViews();
        this.updateConfigView();
    }

    private updateMylistViews() {
        var mylists = this.mylistService.getMylistCollection().getMylists();

        var $template = $(Template.load(Templates.favlist_settings_mylist));
        this.$mylists.empty();
        mylists.forEach((mylist: Mylist) => {
            var $mylist = $template.clone();
            $mylist.data('mylistId', mylist.getMylistId());
            $mylist.find('.favlistMylistTitleEdit').val(mylist.getTitle()).attr('placeholder', mylist.getOriginalTitle());
            this.setEventHandlersForMylistView($mylist);
            this.$mylists.append($mylist);
        });
        this.updateMylistButtons();
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

    private updateConfigView() {
        var config = this.configService.getConfig();
        this.$el.find('.favlistConfigCheckInterval').val(config.getCheckInterval().toString());
        this.$el.find('.favlistConfigMaxNewVideos').val(config.getMaxNewVideos().toString());
        this.$el.find('.favlistConfigHideCheckedList').attr('checked', config.isCheckedListHidden());
        this.$el.find('.favlistConfigOrderDescendant').attr('checked', config.isOrderDescendant());
    }

}
