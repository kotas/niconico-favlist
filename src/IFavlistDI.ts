/// <reference path="./util/Storage.ts" />
/// <reference path="./util/UrlFetcher.ts" />
/// <reference path="./model/Config.ts" />
/// <reference path="./model/ConfigStorage.ts" />
/// <reference path="./model/Mylist.ts" />
/// <reference path="./model/MylistCollectionStorage.ts" />
/// <reference path="./model/MylistCollectionUpdater.ts" />
/// <reference path="./model/MylistFeedFactory.ts" />
/// <reference path="./model/UpdateInterval.ts" />
/// <reference path="./service/ConfigService.ts" />
/// <reference path="./service/MylistService.ts" />
/// <reference path="./service/SubscriptionService.ts" />
/// <reference path="./controller/IFavlistApp.ts" />

interface IFavlistDI {

    register<T>(name: string, initializer: () => T): void;
    resolve<T>(name: string): T;

    resolve(name: "Storage"): util.IStorage;
    resolve(name: "UrlFetcher"): util.IUrlFetcher;

    resolve(name: "ConfigStorage"): IConfigStorage;
    resolve(name: "MylistCollectionStorage"): IMylistCollectionStorage;
    resolve(name: "MylistFeedFactory"): IMylistFeedFactory;
    resolve(name: "UpdateInterval"): IUpdateInterval;

    resolve(name: "ConfigService"): IConfigService;
    resolve(name: "MylistService"): IMylistService;
    resolve(name: "SubscriptionService"): ISubscriptionService;

    resolve(name: "FavlistApp"): IFavlistApp;

}
