/// <reference path="./util/Storage.ts" />
/// <reference path="./util/UrlFetcher.ts" />
/// <reference path="./controller/FavlistApp.ts" />
/// <reference path="./controller/FavlistController.ts" />
/// <reference path="./controller/RegisterController.ts" />
/// <reference path="./model/Config.ts" />
/// <reference path="./model/ConfigStorage.ts" />
/// <reference path="./model/MylistCollectionStorage.ts" />
/// <reference path="./model/MylistFeedFactory.ts" />
/// <reference path="./model/UpdateInterval.ts" />

declare var DI: IFavlistDI;

interface IFavlistDI {

    register<T>(name: string, initializer: () => T): void;
    resolve<T>(name: string): T;

    resolve(name: "Storage"): util.IStorage;
    resolve(name: "UrlFetcher"): util.IUrlFetcher;

    resolve(name: "Config"): IConfig;
    resolve(name: "ConfigStorage"): IConfigStorage;
    resolve(name: "MylistCollectionStorage"): IMylistCollectionStorage;
    resolve(name: "MylistFeedFactory"): IMylistFeedFactory;
    resolve(name: "UpdateInterval"): IUpdateInterval;

    resolve(name: "FavlistApp"): IFavlistApp;
    resolve(name: "FavlistController"): IFavlistController;
    resolve(name: "RegisterController"): IRegisterController;

}
