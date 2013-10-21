/// <reference path="./View.ts" />

/**
 * events:
 *   - registerRequest()
 *   - unregisterRequest()
 */
class RegisterView extends View {

    private registered: boolean = false;

    constructor() {
        super(RegisterView.findParent(), Template.load(Templates.register));
        this.setEventHandlers();
    }

    setRegistered(registered: boolean) {
        if (this.registered !== registered) {
            this.registered = registered;
            this.$el.toggleClass('registered', this.registered);
        }
    }

    private setEventHandlers() {
        this.$el.find('.favlistRegisterButton').click(() => {
            this.emitEvent('registerRequest');
            return false;
        });
        this.$el.find('.favlistUnregisterButton').click(() => {
            this.emitEvent('unregisterRequest');
            return false;
        });
    }

    private static findParent(): JQuery {
        var $parent = $('#SYS_box_mylist_header table td').eq(0);
        if ($parent.length > 0) {
            return $parent;
        }

        $parent = $('#watchBtns').eq(0);
        if ($parent.length > 0) {
            return $('<div />').css({
                'display': 'inline-block',
                'margin-left': '8px'
            }).insertAfter($parent);
        }

        $parent = Template.load(Templates.rescue_register);
        $parent.appendTo(document.body);
        return $parent;
    }

}
