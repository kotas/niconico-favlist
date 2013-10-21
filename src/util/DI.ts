
module util {

    var initializers: { [name: string]: () => any } = {};
    var instances: { [name: string]: any } = {};

    export var DI = {

        register: (name: string, initializer: () => any): void => {
            initializers[name] = initializer;
        },

        resolve: (name: string): any => {
            if (typeof instances[name] !== 'undefined') {
                return instances[name];
            }
            if (typeof initializers[name] === 'undefined') {
                throw new Error('[DI] Not registered: ' + name);
            }
            instances[name] = initializers[name]();
            initializers[name] = undefined;
            delete initializers[name];
            return instances[name];
        }

    }

}
