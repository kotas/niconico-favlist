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
        this.setEventHandlers();
    }

    private setEventHandlers() {
        this.setEventHandlersForView();
        this.setEventHandlersForConfigService();
        this.setEventHandlersForMylistService();
    }

    private setEventHandlersForView() {
        var escapeHandler: (eventObject: JQueryEventObject) => any;
        this.onShow.addListener(() => {
            if (!escapeHandler) {
                escapeHandler = (event: JQueryEventObject) => {
                    if ((<any>event).keyCode === 27) this.onCancel.trigger(null);
                };
                $(window.document).bind('keyup', escapeHandler);
            }
        });
        this.onHide.addListener(() => {
            if (escapeHandler) {
                $(window.document).unbind('keyup', escapeHandler);
                escapeHandler = null;
            }
        });
        this.$el.find('.favlistSettingMylistSearchEdit').keyup(() => {
            this.filterMylists(this.$el.find('.favlistSettingMylistSearchEdit').val());
            this.updateMylistButtons();
        });
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

    private setEventHandlersForConfigService() {
        this.configService.onUpdate.addListener(() => {
            if (this.isHidden()) return;
            this.updateConfigView();
        });
    }

    private setEventHandlersForMylistService() {
        this.mylistService.onUpdate.addListener(() => {
            if (this.isHidden()) return;
            this.updateMylistViews();
        });
        this.mylistService.onUpdateMylist.addListener((args) => {
            if (this.isHidden()) return;
            this.updateMylistView(
                this.$mylists.children('[data-mylistId="' + args.mylist.getMylistId().toString() + '"]'),
                args.mylist
            );
        });
    }

    private filterMylists(filter :string) {
        filter = filter.replace(/[ \t\u3000]+/g, "").toLowerCase();
        this.$mylists.children().each((i, el) => {
            var $mylist = $(el);
            var searchString: string = $mylist.data('searchString') || '';
            if (filter === '' || searchString.indexOf(filter) >= 0) {
                $mylist.show();
            } else {
                $mylist.hide();
            }
        });
    }

    private makeSearchString(mylist: Mylist) {
        return [
            mylist.getOriginalTitle(),
            mylist.getOverrideTitle(),
            mylist.getURL()
        ].join("\n").replace(/[ \t\u3000]+/g, "").toLowerCase();
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
            $mylist.attr('data-mylistId', mylist.getMylistId().toString());
            this.updateMylistView($mylist, mylist);
            this.setEventHandlersForMylistView($mylist);
            this.$mylists.append($mylist);
        });

        this.$el.find('.favlistSettingMylistSearchEdit').val('');
        this.updateMylistButtons();
    }

    private updateMylistView($mylist: JQuery, mylist: Mylist) {
        $mylist.data('searchString', this.makeSearchString(mylist));
        $mylist.find('.favlistMylistLink').attr('href', mylist.getURL());
        $mylist.find('.favlistMylistTitleEdit').val(mylist.getTitle()).attr('placeholder', mylist.getOriginalTitle());
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
        var searching = this.$el.find('.favlistSettingMylistSearchEdit').val() !== '';
        $mylists.each((i, el) => {
            var $mylist = $(el);
            $mylist.find('.favlistMylistMoveUpButton').attr('disabled', (i === 0) || searching);
            $mylist.find('.favlistMylistMoveDownButton').attr('disabled', (i === total - 1) || searching);
            $mylist.find('.favlistMylistMoveTopButton').attr('disabled', (i === 0) || searching);
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
