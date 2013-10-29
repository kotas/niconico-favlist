/// <reference path="./View.ts" />
/// <reference path="./FavlistSettingsMylistSubview.ts" />
/// <reference path="../service/SettingsService.ts" />

class FavlistSettingsView extends View {

    onSave = new util.Event<ISettings>();
    onCancel = new util.Event<void>();

    onImportRequest = new util.Event<void>();
    onImportApply = new util.Event<{ importSetting: string }>();
    onImportCancel = new util.Event<void>();

    onExportRequest = new util.Event<void>();
    onExportClose = new util.Event<void>();

    onOPMLExportRequest = new util.Event<void>();

    private $mylists: JQuery;
    private mylistViews: FavlistSettingsMylistSubview[];

    constructor(
        private settingsService: ISettingsService
    ) {
        super(Template.load(Templates.favlist_settings));
        this.$mylists = this.$el.find('.favlistSettingMylists');
        this.setEventHandlers();
    }

    private setEventHandlers() {
        this.setEventHandlersForView();
        this.setEventHandlersForSettingsService();
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
            this.$el.find('.favlistSettingsMainPage').show();
            this.$el.find('.favlistSettingsEditorPage').hide();
        });
        this.onHide.addListener(() => {
            if (escapeHandler) {
                $(window.document).unbind('keyup', escapeHandler);
                escapeHandler = null;
            }
        });

        this.$el.find('.favlistSettingMylistSearchEdit').keyup(() => {
            this.filterMylists(this.$el.find('.favlistSettingMylistSearchEdit').val());
        });

        this.$el.find('.favlistSaveSettingsButton').click(() => {
            this.onSave.trigger({
                mylistSettings: this.getMylistSettings(),
                configSettings: this.getConfigSettings()
            });
            return false;
        });
        this.$el.find('.favlistCancelSettingsButton').click(() => {
            this.onCancel.trigger(null);
            return false;
        });

        this.$el.find('.favlistSettingsImportLink').click(() => {
            this.onImportRequest.trigger(null);
            return false;
        });
        this.$el.find('.favlistSettingsExportLink').click(() => {
            this.onExportRequest.trigger(null);
            return false;
        });
        this.$el.find('.favlistSettingsOPMLExportLink').click(() => {
            this.onOPMLExportRequest.trigger(null);
            return false;
        });

        this.$el.find('.favlistSettingsEditorForm textarea').click(function () {
            this.select();
        });
        this.$el.find('.favlistImportApplyButton').click(() => {
            this.onImportApply.trigger({ importSetting: this.$el.find('.favlistSettingsImportEditor').val() });
            return false;
        });
        this.$el.find('.favlistImportCancelButton').click(() => {
            this.onImportCancel.trigger(null);
            return false;
        });
        this.$el.find('.favlistExportCloseButton').click(() => {
            this.onExportClose.trigger(null);
            return false;
        });
    }

    private setEventHandlersForSettingsService() {
        this.settingsService.onUpdate.addListener(() => {
            if (this.isHidden()) return;
            this.update();
        });
        this.settingsService.onUpdateMylist.addListener((args) => {
            if (this.isHidden()) return;
            var mylistId = args.mylist.getMylistId();
            this.mylistViews.forEach((view) => {
                if (view.hasMylistId(mylistId)) {
                    view.render(args.mylist);
                }
            });
        });
        this.settingsService.onImport.addListener(() => {
            alert("設定をインポートして設定画面に反映しました。\n設定内容をご確認の上、問題なければ「設定を保存」してください。");
        });
    }

    showImportPage() {
        this.$el.find('.favlistSettingsImportEditor').val('');
        this.$el.find('.favlistSettingsMainPage').slideUp();
        this.$el.find('.favlistSettingsEditorPage').removeClass('exporting').addClass('importing').slideDown();
    }

    showExportPage(settings: string) {
        this.$el.find('.favlistSettingsExportEditor').val(settings);

        var dataURI: string = 'data:application/octet-stream,' + encodeURIComponent(settings);
        this.$el.find('.favlistSettingsDownloadExportLink').attr('href', dataURI);

        this.$el.find('.favlistSettingsMainPage').slideUp();
        this.$el.find('.favlistSettingsEditorPage').removeClass('importing').addClass('exporting').slideDown();
    }

    exportOPML(opml: string) {
        var dataURI: string = 'data:text/xml;charset=utf-8,' + encodeURIComponent(opml);
        window.open(dataURI, '_blank');
    }

    returnToMainPage() {
        this.$el.find('.favlistSettingsEditorPage').slideUp();
        this.$el.find('.favlistSettingsMainPage').slideDown();
    }

    showError(error: Error) {
        alert(error.message || error);
    }

    private filterMylists(filter :string) {
        filter = filter.replace(/[ \t\u3000]+/g, "").toLowerCase();
        this.mylistViews.forEach((view) => view.toggleByFilter(filter));
        this.updateMylistButtons();
    }

    private getMylistSettings(): IMylistSetting[] {
        var settings: IMylistSetting[] = new Array(this.mylistViews.length);
        this.mylistViews.forEach((view) => {
            settings[view.getIndex()] = view.getMylistSetting();
        });
        return settings;
    }

    private getConfigSettings(): IConfigSetting {
        return {
            checkInterval:   parseInt(this.$el.find('.favlistConfigCheckInterval').val(), 10),
            maxNewVideos:    parseInt(this.$el.find('.favlistConfigMaxNewVideos').val(), 10),
            hideCheckedList: this.$el.find('.favlistConfigHideCheckedList').is(':checked'),
            orderDescendant: this.$el.find('.favlistConfigOrderDescendant').is(':checked')
        };
    }

    update() {
        this.updateMylistViews();
        this.updateConfigView();
    }

    private updateMylistViews() {
        var mylists = this.settingsService.getMylistCollection().getMylists();

        this.mylistViews = [];
        this.$mylists.empty();
        mylists.forEach((mylist: Mylist) => {
            var mylistView = new FavlistSettingsMylistSubview();
            this.setEventHandlersForMylistView(mylist, mylistView);
            mylistView.render(mylist);
            mylistView.appendTo(this.$mylists);
            this.mylistViews.push(mylistView);
        });

        this.$el.find('.favlistSettingMylistSearchEdit').val('');
        this.updateMylistButtons();
    }

    private setEventHandlersForMylistView(mylist: Mylist, mylistView: FavlistSettingsMylistSubview) {
        mylistView.onMove.addListener(() => {
            this.updateMylistButtons();
        });
        mylistView.onRemoved.addListener(() => {
            var index = this.mylistViews.indexOf(mylistView);
            if (index >= 0) {
                this.mylistViews.splice(index, 1);
            }
            this.updateMylistButtons();
        });
    }

    private updateMylistButtons() {
        this.mylistViews.forEach((view) => view.updateButtons());
    }

    private updateConfigView() {
        var config = this.settingsService.getConfig();
        this.$el.find('.favlistConfigCheckInterval').val(config.getCheckInterval().toString());
        this.$el.find('.favlistConfigMaxNewVideos').val(config.getMaxNewVideos().toString());
        this.$el.find('.favlistConfigHideCheckedList').attr('checked', config.isCheckedListHidden());
        this.$el.find('.favlistConfigOrderDescendant').attr('checked', config.isOrderDescendant());
    }

}
