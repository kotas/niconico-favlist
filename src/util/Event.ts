module util {

    export interface IEvent<T> {
        addListener(listener: (args: T) => void): void;
        addOnceListener(listener: (args: T) => void): void;
        removeListener(listener: (args: T) => void): boolean;
        clearListeners(): void;
        trigger(args: T): void;
        proxy(): (args: T) => void;
    }

    export class Event<T> implements IEvent<T> {

        private listeners: Function[];

        addListener(listener: (args: T) => void): void {
            if (!this.listeners) {
                this.listeners = [];
            }
            this.listeners.push(listener);
        }

        addOnceListener(listener: (args: T) => void): void {
            (<any>listener).once = true;
            this.addListener(listener);
        }

        removeListener(listener: (args: T) => void): boolean {
            if (!this.listeners) return false;

            var index = this.listeners.indexOf(listener);
            if (index < 0) {
                return false;
            }

            this.listeners.splice(index, 1);
            return true;
        }

        clearListeners(): void {
            this.listeners = null;
        }

        trigger(args: T): void {
            if (!this.listeners) return;

            for (var i = this.listeners.length - 1; i >= 0; i--) {
                var listener = this.listeners[i];
                if ((<any>listener).once) {
                    this.listeners.splice(i, 1);
                }
                listener.call(null, args);
            }
        }

        proxy(): (args: T) => void {
            return (args: T) => {
                this.trigger(args);
            };
        }

    }

}
