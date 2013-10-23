/// <reference path="./IFavlistDI.ts" />
/// <reference path="./util/DI.ts" />
/// <reference path="./userscript/NicovideoSubscriptionService.ts" />
/// <reference path="./userscript/NicovideoFavlistView.ts" />
/// <reference path="./userscript/NicovideoSubscribeView.ts" />

var DI: IFavlistDI = util.DI;

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

DI.register('MylistCollectionUpdater', (): IMylistCollectionUpdater => {
    return new MylistCollectionUpdater(DI.resolve('MylistFeedFactory'));
});

DI.register('MylistFeedFactory', (): IMylistFeedFactory => {
    return new MylistFeedFactory(DI.resolve('UrlFetcher'), DI.resolve('Config').getUserAgent());
});

DI.register('UpdateInterval', (): IUpdateInterval => {
    return new UpdateInterval(DI.resolve('Storage'), DI.resolve('Config'));
});


DI.register('ConfigService', (): IConfigService => {
    return new ConfigService(DI.resolve('ConfigStorage'));
});

DI.register('MylistService', (): IMylistService => {
    return new MylistService(
        DI.resolve('MylistStorage'),
        DI.resolve('UpdateInterval'),
        DI.resolve('MylistFeedFactory')
    );
});

DI.register('SubscriptionService', (): ISubscriptionService => {
    return new NicovideoSubscriptionService(
        DI.resolve('MylistCollectionStorage'),
        DI.resolve('UpdateInterval')
    );
});


DI.register('FavlistView', (): IFavlistView => {
    return new NicovideoFavlistView();
});

DI.register('SubscribeView', (): ISubscribeView => {
    return new NicovideoSubscribeView(DI.resolve('SubscriptionService'));
});


DI.register('FavlistApp', (): IFavlistApp => {
    return new FavlistApp();
});

DI.register('FavlistController', (): IFavlistController => {
    return new FavlistController(
        DI.resolve('FavlistView'),
        DI.resolve('ConfigService'),
        DI.resolve('MylistService')
    );
});

DI.register('SubscribeController', (): ISubscribeController => {
    return new SubscribeController(
        DI.resolve('SubscribeView'),
        DI.resolve('SubscriptionService')
    );
});
