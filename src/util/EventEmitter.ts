
module util {

    export interface IEventDelegator {
        (eventName: string, args: any[]): any;
    }

    export interface IEventEmitter {
        addListener(eventName: string, listener: Function): void;
        addOnceListener(eventName: string, listener: Function): void;
        removeListener(eventName: string, listener: Function): boolean;
        addEventDelegator(delegator: IEventDelegator): void;
        removeEventDelegator(delegator: IEventDelegator): boolean;
        emitEvent(eventName: string, args?: any[]): void;
    }

    export class EventEmitter implements IEventEmitter {

        private listeners: { [eventName: string]: Function[] } = {};
        private delegators: IEventDelegator[] = [];

        addListener(eventName: string, listener: Function): void {
            (this.listeners[eventName] || (this.listeners[eventName] = [])).push(listener);
        }

        addOnceListener(eventName: string, listener: Function): void {
            (<any>listener).once = true;
            this.addListener(eventName, listener);
        }

        removeListener(eventName: string, listener: Function): boolean {
            if (!this.listeners[eventName]) {
                return false;
            }

            var index = this.listeners[eventName].indexOf(listener);
            if (index < 0) {
                return false;
            }

            this.listeners[eventName].splice(index, 1);
            if (this.listeners[eventName].length === 0) {
                delete this.listeners[eventName];
            }
            return true;
        }

        addEventDelegator(delegator: IEventDelegator): void {
            this.delegators.push(delegator);
        }

        removeEventDelegator(delegator: IEventDelegator): boolean {
            var index = this.delegators.indexOf(delegator);
            if (index >= 0) {
                this.delegators.splice(index, 1);
                return true;
            } else {
                return false;
            }
        }

        emitEvent(eventName: string, args: any[] = []): void {
            var i: number;
            var listeners = this.listeners[eventName];
            if (listeners) {
                for (i = listeners.length - 1; i >= 0; i--) {
                    var listener = listeners[i];
                    if ((<any>listener).once) {
                        this.removeListener(eventName, listener);
                    }
                    listener.apply(null, args);
                }
            }
            if (this.delegators.length > 0) {
                for (i = this.delegators.length - 1; i >= 0; i--) {
                    this.delegators[i](eventName, args);
                }
            }
        }

    }

}
