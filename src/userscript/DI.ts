/// <reference path="../IFavlistDI.ts" />
/// <reference path="../util/DI.ts" />
/// <reference path="../userscript/UserScriptSubscriptionService.ts" />
/// <reference path="../userscript/UserScriptApp.ts" />

module userscript {

    export var DI: IFavlistDI = util.DI;

    DI.register('Storage', (): util.IStorage => {
        return util.chooseStorage();
    });

    DI.register('UrlFetcher', (): util.IUrlFetcher => {
        return util.chooseUrlFetcher();
    });


    DI.register('ConfigStorage', (): IConfigStorage => {
        return new ConfigStorage(DI.resolve('Storage'));
    });

    DI.register('MylistCollectionStorage', (): IMylistCollectionStorage => {
        return new MylistCollectionStorage(DI.resolve('Storage'));
    });

    DI.register('MylistFeedFactory', (): IMylistFeedFactory => {
        return new MylistFeedFactory(DI.resolve('UrlFetcher'));
    });

    DI.register('UpdateInterval', (): IUpdateInterval => {
        return new UpdateInterval(DI.resolve('Storage'), DI.resolve('ConfigService'));
    });


    DI.register('ConfigService', (): IConfigService => {
        return new ConfigService(DI.resolve('ConfigStorage'));
    });

    DI.register('MylistService', (): IMylistService => {
        return new MylistService(
            DI.resolve('MylistCollectionStorage'),
            DI.resolve('UpdateInterval'),
            DI.resolve('MylistFeedFactory')
        );
    });

    DI.register('SubscriptionService', (): ISubscriptionService => {
        return new UserScriptSubscriptionService(
            DI.resolve('MylistCollectionStorage'),
            DI.resolve('UpdateInterval')
        );
    });


    DI.register('FavlistApp', (): IFavlistApp => {
        return new UserScriptApp();
    });

}
