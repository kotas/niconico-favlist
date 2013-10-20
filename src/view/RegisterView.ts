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
        var $parents = $('#SYS_box_mylist_header table td, .userDetail #watchBtns').eq(0);
        if ($parents.length === 0) {
            $parents = $('#PAGEBODY, body').eq(0);
        }
        return $parents;
    }

}
