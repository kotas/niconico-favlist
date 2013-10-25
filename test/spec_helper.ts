/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />
/// <reference path="../typings/sinon.d.ts" />
/// <reference path="../compiled/compiled.d.ts" />

var expect = chai.expect;

module helper {

    export interface IMockStorage {
        get: SinonSpy;
        set: SinonSpy;
    }

    export function getMockStorage(): IMockStorage {
        var dict = {};
        return {
            get: sinon.spy((key: string, defaultValue?: any): any => {
                return (dict.hasOwnProperty(key)) ? dict[key] : defaultValue;
            }),
            set: sinon.spy((key: string, value: any): void => {
                dict[key] = value;
            })
        };
    }

}

