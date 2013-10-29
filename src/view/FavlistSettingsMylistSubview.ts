/// <reference path="./Subview.ts" />
/// <reference path="../service/SettingsService.ts" />

class FavlistSettingsMylistSubview extends Subview {

    onMove = new util.Event<void>();
    onRemoved = new util.Event<void>();

    constructor() {
        super(Template.load(Templates.favlist_settings_mylist));
        this.setEventHandlersForView();
    }

    private setEventHandlersForView() {
        this.$el.find('.favlistMylistMoveUpButton').click(() => {
            var $prev = this.$el.prev();
            if ($prev.length > 0) {
                this.$el.insertBefore($prev);
                this.onMove.trigger(null);
            }
        });
        this.$el.find('.favlistMylistMoveDownButton').click(() => {
            var $next = this.$el.next();
            if ($next.length > 0) {
                this.$el.insertAfter($next);
                this.onMove.trigger(null);
            }
        });
        this.$el.find('.favlistMylistMoveTopButton').click(() => {
            this.$el.parent().prepend(this.$el);
            this.onMove.trigger(null);
        });
        this.$el.find('.favlistMylistRemoveButton').click(() => {
            this.$el.remove();
            this.onRemoved.trigger(null);
        });
    }

    render(mylist: Mylist) {
        this.$el.data('mylistId', mylist.getMylistId());
        this.$el.data('searchString', this.makeSearchString(mylist));
        this.$el.find('.favlistMylistLink').attr('href', mylist.getURL());
        this.$el.find('.favlistMylistTitleEdit')
            .val(mylist.getTitle())
            .attr('placeholder', mylist.getOriginalTitle());
    }

    private makeSearchString(mylist: Mylist) {
        return [
            mylist.getOriginalTitle(),
            mylist.getOverrideTitle(),
            mylist.getURL()
        ].join("\n").replace(/[ \t\u3000]+/g, "").toLowerCase();
    }

    getIndex(): number {
        return this.$el.prevAll().length;
    }

    hasMylistId(mylistId: MylistId): boolean {
        var id = this.$el.data('mylistId');
        return (id && id.equalTo(mylistId));
    }

    toggleByFilter(filter: string) {
        if (filter === '') {
            this.$el.removeClass('filtering');
            this.$el.show();
            return;
        }

        this.$el.addClass('filtering');
        var searchString: string = this.$el.data('searchString') || '';
        if (searchString.indexOf(filter) >= 0) {
            this.$el.show();
        } else {
            this.$el.hide();
        }
    }

    updateButtons() {
        var filtering: boolean = this.$el.hasClass('filtering');
        var isFirst: boolean = this.$el.is(':first-child');
        var isLast: boolean = this.$el.is(':last-child');

        this.$el.find('.favlistMylistMoveUpButton').attr('disabled', isFirst || filtering);
        this.$el.find('.favlistMylistMoveDownButton').attr('disabled', isLast || filtering);
        this.$el.find('.favlistMylistMoveTopButton').attr('disabled', isFirst || filtering);
    }

    getMylistSetting(): IMylistSetting {
        var mylistId: MylistId = this.$el.data('mylistId');
        if (!mylistId) {
            throw new Error('保存中にエラーが発生しました');
        }

        var title: string = this.$el.find('.favlistMylistTitleEdit').val();
        return { mylistId: mylistId, title: title };
    }

}
